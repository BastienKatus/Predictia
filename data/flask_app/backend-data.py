import os
import psycopg2
import pandas as pd
import joblib
import predictia_ml
import pandas as pd
import re
import numpy as np
from sklearn.preprocessing import StandardScaler
from sqlalchemy import create_engine
from flask import Flask, jsonify, request
from datetime import datetime

TF_ENABLE_ONEDNN_OPTS=0
model_rl = joblib.load(os.path.join("..", "model_training", "model_rl.pkl"))
model_seq = joblib.load(os.path.join("..", "model_training", "model_sequential.pkl"))
scaler = joblib.load(os.path.join("..", "model_training", "scaler_sequential.pkl"))

app = Flask(__name__)

# Remplacez par vos détails de connexion PostgreSQL
DB_HOST = 'localhost'
DB_PORT = '5433'
DB_USER = 'admin'
DB_PASSWORD = 'admin'
DB_NAME = 'predictia_soccer_manager'

# Initialisation des DataFrames
df_players = None
df_clubs = None
df_game_lineups = None
df_games = None
DB_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def load_data():
    global df_players, df_clubs, df_game_lineups, df_games
    engine = create_engine(DB_URI)
    df_players = pd.read_sql("SELECT * FROM players", engine)
    df_clubs = pd.read_sql("SELECT * FROM clubs", engine)
    df_game_lineups = pd.read_sql("SELECT * FROM game_lineups", engine)
    df_games = pd.read_sql("SELECT * FROM games", engine)

def execute_query(query, args=None):
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        cursor = connection.cursor()
        cursor.execute(query, args or ())
        data = cursor.fetchall()
        cursor.close()
        connection.close()
        return data
    except Exception as e:
        return {'error': str(e)}

@app.route('/predict', methods=['GET'])
def predict():
    # Récupérer les paramètres de la requête
    home_team_id = request.args.get('home_team_id', type=int)
    away_team_id = request.args.get('away_team_id', type=int)
    date_str = request.args.get('date')

    # Valider le format de la date si elle est fournie, sinon utiliser la date d'aujourd'hui
    if date_str:
        # Vérifier que la date est au format YYYY-MM-DD
        if not re.match(r'\d{4}-\d{2}-\d{2}', date_str):
            return jsonify({'error': 'Date format is invalid. Use YYYY-MM-DD.'}), 400
        # Convertir la chaîne de caractères en objet date
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Date format is invalid. Use YYYY-MM-DD.'}), 400
    else:
        # Utiliser la date du jour si aucune date n'est fournie
        date = datetime.today().date()

    # Assurez-vous que les ID d'équipe sont fournis
    if home_team_id is None or away_team_id is None:
        return jsonify({'error': 'Missing home_team_id or away_team_id'}), 400

    # Préparer les caractéristiques pour un match donné
    # Ici, vous devriez également passer la date à la fonction si elle est nécessaire pour la prédiction
    features_resultat, features_probas = predictia_ml.preparer_caracteristiques_match(df_games, df_players, df_game_lineups, home_team_id, away_team_id, date)

    # Faire la prédiction des probabilités
    resultat = predictia_ml.predire_resultat(model_seq, features_resultat, scaler, 0.75)
    probas = predictia_ml.predire_proba(model_rl, features_probas)
    probas_list = probas.tolist()
    print(probas_list)
    print(np.argmax(resultat.tolist()))
    # Créer un dictionnaire pour la réponse JSON
    response = {
        'probabilite_defaite': probas_list[0],
        'probabilite_nul': probas_list[1],
        'probabilite_victoire': probas_list[2],
        'classification_predictia': str(np.argmax(resultat.tolist()))
    }
    return jsonify(response)

if __name__ == '__main__':
    load_data()
    app.run(debug=True, port=5000)

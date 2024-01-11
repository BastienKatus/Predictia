from flask import Flask, jsonify, request
import os
import psycopg2
import pandas as pd
import joblib
import predictia_ml
from sqlalchemy import create_engine
import pandas as pd

model = joblib.load(os.path.join("..", "model_training", "model.pkl"))

app = Flask(__name__)

# Remplacez par vos détails de connexion PostgreSQL
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_USER = 'admin'
DB_PASSWORD = 'admin'
DB_NAME = 'predictia'

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

    # Assurez-vous que les ID d'équipe sont fournis
    if home_team_id is None or away_team_id is None:
        return jsonify({'error': 'Missing home_team_id or away_team_id'}), 400
    # Préparer les caractéristiques pour un match donné
    match_features = predictia_ml.preparer_caracteristiques_match(df_games, df_players, df_game_lineups, home_team_id, away_team_id)
    # Faire la prédiction des probabilités
    probas = predictia_ml.predire_probabilites(model, match_features)
    # Traiter les probabilités comme nécessaire
    # Par exemple, les ajouter au DataFrame des caractéristiques et filtrer les colonnes
    # Convertir l'array NumPy en liste Python
    probas_list = probas.tolist()
    print(probas_list)
    # Créer un dictionnaire pour la réponse JSON
    response = {
        'probabilite_defaite': probas_list[0][0],
        'probabilité_nul': probas_list[0][1],
        'probabilité_victoire': probas_list[0][2]
    }
    return jsonify(response)

if __name__ == '__main__':
    load_data()
    app.run(debug=True, port=5000)

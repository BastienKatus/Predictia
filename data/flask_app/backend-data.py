from flask import Flask, jsonify, request
import os
import psycopg2
import joblib
import predictia_ml
from sqlalchemy import create_engine
import pandas as pd
import predictia_stats

model = joblib.load(os.path.join("..", "model_training", "model.pkl"))

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
df_game_events = None
DB_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def load_data():
    global df_players, df_clubs, df_game_lineups, df_games, df_game_events
    engine = create_engine(DB_URI)
    df_players = pd.read_sql("SELECT * FROM players", engine)
    df_clubs = pd.read_sql("SELECT * FROM clubs", engine)
    df_game_lineups = pd.read_sql("SELECT * FROM game_lineups", engine)
    df_games = pd.read_sql("SELECT * FROM games", engine)
    df_game_events = pd.read_sql("SELECT * FROM game_events", engine)

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
        'probabilite_nul': probas_list[0][1],
        'probabilite_victoire': probas_list[0][2]
    }
    return jsonify(response)


@app.route('/calculate-club-ranking', methods=['GET'])
def calculate_club_ranking():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    classement = predictia_stats.calculer_classement(df_games, df_clubs, club_id_specifique, saison_specifique)

    return classement.to_json(orient='records')

# Endpoint pour calculer les buts marqués par un club dans une saison spécifiée
@app.route('/calculate-goals-scored', methods=['GET'])
def calculate_goals_scored():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    buts_marques = predictia_stats.calculer_buts_marques(df_clubs, df_games, club_id_specifique, saison_specifique)

    return buts_marques.to_json(orient='records')

# Endpoint pour calculer la moyenne des buts marqués par un club dans une saison spécifiée
@app.route('/calculate-average-goals-scored', methods=['GET'])
def calculate_average_goals_scored():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    moyenne_buts_marques = predictia_stats.calculer_moyenne_buts_marques(df_clubs, df_games, club_id_specifique, saison_specifique)

    return moyenne_buts_marques.to_json(orient='records')

# Endpoint pour calculer le total des buts encaissés par un club dans une saison spécifiée
@app.route('/calculate-total-goals-conceded', methods=['GET'])
def calculate_total_goals_conceded():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    total_buts_encaisses = predictia_stats.calculer_total_buts_encaisses(df_clubs, df_games, club_id_specifique, saison_specifique)

    return total_buts_encaisses.to_json(orient='records')

@app.route('/calculate-wins', methods=['GET'])
def calculate_wins():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    nombre_victoires = predictia_stats.calculer_nombre_victoires(df_clubs, df_games, club_id_specifique, saison_specifique)

    return nombre_victoires.to_json(orient='records')


# Endpoint pour calculer le nombre de défaites d'un club dans une saison spécifiée
@app.route('/calculate-losses', methods=['GET'])
def calculate_losses():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    nombre_defaites = predictia_stats.calculer_nombre_defaites(df_clubs, df_games, club_id_specifique, saison_specifique)

    return nombre_defaites.to_json(orient='records')


# Endpoint pour calculer la forme d'un club sur les 5 derniers matchs dans une saison spécifiée
@app.route('/calculate-form-last-5-matches', methods=['GET'])
def calculate_form_last_5_matches():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    forme_5_derniers = predictia_stats.calculer_forme_5_derniers_matchs(df_clubs, df_games, club_id_specifique, saison_specifique)

    return forme_5_derniers.to_json(orient='records')

@app.route('/calculate-yellow-cards', methods=['GET'])
def calculate_yellow_cards():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    cartons_jaunes = predictia_stats.calculer_cartons_jaunes_pour_club(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique)

    return jsonify({'nombre_cartons_jaunes': cartons_jaunes})


# Endpoint pour calculer la moyenne de cartons jaunes par match pour un club dans une saison spécifiée
@app.route('/calculate-average-yellow-cards-per-match', methods=['GET'])
def calculate_average_yellow_cards_per_match():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    moyenne_cartons_jaunes = predictia_stats.calculer_moyenne_cartons_jaunes_par_match(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique)

    return jsonify({'moyenne_cartons_jaunes_par_match': moyenne_cartons_jaunes})


# Endpoint pour calculer le nombre de cartons rouges pour un club dans une saison spécifiée
@app.route('/calculate-red-cards', methods=['GET'])
def calculate_red_cards():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    cartons_rouges = predictia_stats.calculer_nombre_cartons_rouges_par_club(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique)

    return jsonify({'nombre_cartons_rouges': cartons_rouges})


# Endpoint pour calculer le nombre de cartons rouges et la moyenne par match pour un club dans une saison spécifiée
@app.route('/calculate-red-cards-and-average', methods=['GET'])
def calculate_red_cards_and_average():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    resultats_cartons_rouges = predictia_stats.calculer_cartons_rouges_et_moyenne_pour_club(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique)

    return resultats_cartons_rouges.to_json(orient='records')


@app.route('/calculate-goals-matches', methods=['GET'])
def calculate_goals_matches():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    resultats_matchs_avec_buts = predictia_stats.calculer_matchs_avec_buts_pour_club(df_clubs, df_games, club_id_specifique, saison_specifique)

    return resultats_matchs_avec_buts.to_json(orient='records')


# Endpoint pour calculer le nombre de matchs avec au moins un but encaissé par un club dans une saison spécifiée
@app.route('/calculate-conceded-goals-matches', methods=['GET'])
def calculate_conceded_goals_matches():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    resultats_matchs_avec_buts_encaisses = predictia_stats.calculer_matchs_avec_buts_encaisses_pour_club(df_clubs, df_games, club_id_specifique, saison_specifique)

    return resultats_matchs_avec_buts_encaisses.to_json(orient='records')


# Endpoint pour calculer la minute moyenne du premier but marqué par un club dans une saison spécifiée
@app.route('/calculate-average-minute-first-goal', methods=['GET'])
def calculate_average_minute_first_goal():
    #load_data()
    club_id_specifique = request.args.get('club_id', type=int)
    saison_specifique = request.args.get('season', type=int)

    if club_id_specifique is None or saison_specifique is None:
        return jsonify({'error': 'Missing club_id or season'}), 400

    minute_moyenne_premier_but = predictia_stats.calculer_minute_moyenne_premier_but_pour_club(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique)

    return jsonify({'minute_moyenne_premier_but': minute_moyenne_premier_but})

if __name__ == '__main__':
    load_data()
    print("Data loaded.")
    app.run(debug=True, port=5000)

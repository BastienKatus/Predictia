import pandas as pd

def preparer_caracteristiques_match(df_games, df_players, df_game_lineups, home_club_id, away_club_id, date):
    home_market_value = sum_team_value(df_players, starting_lineup_match(df_game_lineups, last_game_id(df_games, home_club_id), home_club_id))
    away_market_value = sum_team_value(df_players, starting_lineup_match(df_game_lineups, last_game_id(df_games, away_club_id), away_club_id))
    home_form = calculer_forme(df_games, home_club_id, str(date), "domicile")
    away_form = calculer_forme(df_games, away_club_id, str(date), "exterieur")
    match_features_resultat = pd.DataFrame({
        'home_club_id': [home_club_id],
        'away_club_id': [away_club_id],
        'home_team_market_value': [home_market_value],
        'away_team_market_value': [away_market_value],
        'home_team_form': [home_form],
        'away_team_form': [away_form]
    })
    match_features_proba = pd.DataFrame({
        'home_forme': [home_form],
        'away_forme': [away_form],
        'home_valeur_marchande': [home_market_value],
        'away_valeur_marchande': [away_market_value]
    })
    return match_features_resultat, match_features_proba

def predire_resultat(model, match_features, scaler, seuil_nul=0.5):
    """
    Prédit le résultat d'un match de football en utilisant un modèle de réseau de neurones entraîné.
    
    Paramètres :
    model : Le modèle de réseau de neurones entraîné.
    match_features : Un DataFrame contenant les caractéristiques du match.
    scaler : L'objet StandardScaler utilisé pour normaliser les caractéristiques d'entraînement.
    seuil_nul : Seuil de confiance pour prédire un match nul.
    
    Retourne :
    str : La prédiction du résultat du match ('victoire', 'nul', 'défaite').
    """
    # Normalisation des caractéristiques du match
    match_features_scaled = scaler.transform(match_features)
    # Faire la prédiction
    prediction_prob = model.predict(match_features_scaled)
    return prediction_prob[0]

def predire_proba(model, match_features):
    # Faire la prédiction
    prediction_prob = model.predict_proba(match_features)
    return prediction_prob[0]

#Toutes les fonctions du notebook
def last_five_games(df_games, club_id, date, lieu='tous'):
    """
    Récupère les 5 derniers matchs d'un club spécifié avant une date donnée en fonction du lieu du match.
    
    Paramètres:
    df_games (DataFrame) : DataFrame des matchs.
    club_id (int) : ID du club.
    date (str ou pd.Timestamp) : Date avant laquelle les matchs doivent être récupérés.
    lieu (str) : 'domicile', 'exterieur', ou 'tous' pour filtrer les matchs.
    
    Retourne:
    DataFrame : Les matchs demandés avec les informations détaillées.
    """
    # Assurer que la colonne 'date' est au format datetime
    df_games['date'] = pd.to_datetime(df_games['date'])

    # Filtrage des matchs avant la date donnée
    matchs_du_club = df_games[df_games['date'] < date]
    
    if lieu == 'domicile':
        matchs_du_club = matchs_du_club[matchs_du_club['home_club_id'] == club_id]
    elif lieu == 'exterieur':
        matchs_du_club = matchs_du_club[matchs_du_club['away_club_id'] == club_id]
    else:  # 'tous'
        matchs_du_club = matchs_du_club[(matchs_du_club['home_club_id'] == club_id) | (matchs_du_club['away_club_id'] == club_id)]
    
    # Tri des matchs par date et sélection des 5 derniers
    matchs_du_club = matchs_du_club.sort_values(by='date', ascending=False).head(5)

    # Ajout des informations supplémentaires
    matchs_du_club['adversaire_id'] = matchs_du_club.apply(lambda row: row['away_club_id'] if row['home_club_id'] == club_id else row['home_club_id'], axis=1)
    matchs_du_club['lieu'] = matchs_du_club.apply(lambda row: 'domicile' if row['home_club_id'] == club_id else 'exterieur', axis=1)
    matchs_du_club['résultat'] = matchs_du_club.apply(lambda row: 'victoire' if (row['home_club_id'] == club_id and row['home_club_goals'] > row['away_club_goals']) or (row['away_club_id'] == club_id and row['away_club_goals'] > row['home_club_goals']) else 'défaite' if (row['home_club_id'] == club_id and row['home_club_goals'] < row['away_club_goals']) or (row['away_club_id'] == club_id and row['away_club_goals'] < row['home_club_goals']) else 'nul', axis=1)

    return matchs_du_club[['date', 'home_club_id', 'away_club_id', 'adversaire_id', 'lieu', 'home_club_goals', 'away_club_goals', 'résultat']]
    
def last_game_id(df_games, club_id):
    """
    Récupère l'ID du dernier match joué par un club spécifié.

    Paramètres:
    df_games (DataFrame) : DataFrame des matchs.
    club_id (int) : ID du club.

    Retourne:
    int : ID du dernier match joué par le club.
    """
    # Filtrer les matchs impliquant le club
    matchs_du_club = df_games[(df_games['home_club_id'] == club_id) | (df_games['away_club_id'] == club_id)]
    
    # Trier par date en ordre décroissant et prendre le premier match
    dernier_match = matchs_du_club.sort_values(by='date', ascending=False).iloc[0]

    return dernier_match['game_id']

def match_sheet(df_game_lineups, match_id, club_id):
    """
    Récupère tous les player_id qui ont participé à un match spécifique pour un club donné.
    
    Paramètres:
    df_game_lineups (DataFrame) : DataFrame des compositions d'équipe.
    match_id (int) : ID du match.
    club_id (int) : ID du club.
    
    Retourne:
    Liste : Les identifiants (player_id) des joueurs qui ont participé au match.
    """
    # Filtrer pour obtenir les lignes correspondant au match_id et club_id spécifiés
    lineup_du_match = df_game_lineups[(df_game_lineups['game_id'] == match_id) & (df_game_lineups['club_id'] == club_id)]
    
    # Récupérer les player_id
    joueurs = lineup_du_match['player_id'].tolist()

    return joueurs

def starting_lineup_match(df_game_lineups, match_id, club_id):
    """
    Récupère les player_id des joueurs qui étaient dans la composition de départ d'un match spécifique pour un club donné.
    
    Paramètres:
    df_game_lineups (DataFrame) : DataFrame des compositions d'équipe.
    match_id (int) : ID du match.
    club_id (int) : ID du club.
    
    Retourne:
    Liste : Les identifiants (player_id) des joueurs de la composition de départ.
    """
    #df_game_lineups = data_dict['game_lineups']
    # Filtrer pour obtenir les lignes correspondant au match_id, club_id et type 'starting_lineup'
    lineup_du_match = df_game_lineups[(df_game_lineups['game_id'] == match_id) & 
                                      (df_game_lineups['club_id'] == club_id) & 
                                      (df_game_lineups['type'] == 'starting_lineup')]
    
    # Récupérer les player_id
    joueurs = lineup_du_match['player_id'].tolist()

    return joueurs

def market_value_player(df_player, player_id):
    """
    Récupère la valeur marchande d'un joueur spécifié.
    
    Paramètres:
    df_player_valuations (DataFrame) : DataFrame des évaluations des joueurs.
    player_id (int) : ID du joueur.
    
    Retourne:
    float : La valeur marchande du joueur en euros.
    """
    # Trouver l'entrée correspondant au player_id
    valeur_joueur = df_player[df_player['player_id'] == player_id]['market_value_in_eur']

    # Retourner la valeur marchande, ou None si le joueur n'est pas trouvé
    return valeur_joueur.iloc[0] if not valeur_joueur.empty else None

def mean_team_value(df_player, liste_player_id):
    """
    Calcule la valeur marchande moyenne d'une équipe.
    
    Paramètres:
    df_player_valuations (DataFrame) : DataFrame des évaluations des joueurs.
    liste_player_id (List[int]) : Liste des ID des joueurs.
    
    Retourne:
    float : Valeur marchande moyenne de l'équipe.
    """
    valeurs = [market_value_player(df_player, player_id) for player_id in liste_player_id]
    valeurs = [v for v in valeurs if v is not None]  # Exclure les valeurs None
    return sum(valeurs) / len(valeurs) if valeurs else 0

def sum_team_value(df_player, liste_player_id):
    """
    Calcule la somme des valeurs marchandes d'une équipe.
    
    Paramètres:
    df_player_valuations (DataFrame) : DataFrame des évaluations des joueurs.
    liste_player_id (List[int]) : Liste des ID des joueurs.
    
    Retourne:
    float : Somme des valeurs marchandes de l'équipe.
    """
    valeurs = [market_value_player(df_player, player_id) for player_id in liste_player_id]
    valeurs = [v for v in valeurs if v is not None]  # Exclure les valeurs None
    return sum(valeurs)

def predire_resultat(model, match_features, scaler, seuil_nul=0.5):
    """
    Prédit le résultat d'un match de football en utilisant un modèle de réseau de neurones entraîné.
    
    Paramètres :
    model : Le modèle de réseau de neurones entraîné.
    match_features : Un DataFrame contenant les caractéristiques du match.
    scaler : L'objet StandardScaler utilisé pour normaliser les caractéristiques d'entraînement.
    seuil_nul : Seuil de confiance pour prédire un match nul.
    
    Retourne :
    str : La prédiction du résultat du match ('victoire', 'nul', 'défaite').
    """
    # Normalisation des caractéristiques du match
    match_features_scaled = scaler.transform(match_features)

    # Faire la prédiction
    prediction_prob = model.predict(match_features_scaled)
    return prediction_prob[0]

def get_name(df_clubs, club_id):
    """
    Renvoie le nom du club de football basé sur son identifiant.

    Paramètres:
    club_id (int): L'identifiant du club.

    Retourne:
    str: Le nom du club.
    """
    # Trouver la ligne correspondante au club_id
    club_info = df_clubs[df_clubs['club_id'] == club_id]

    # Renvoie le nom du club s'il est trouvé, sinon renvoie None
    if not club_info.empty:
        return club_info['name'].iloc[0]
    else:
        return None

def calculer_forme(df_games, club_id, date_du_match, lieu='tous'):
    """
    Calcule la forme d'un club sur ses 5 derniers matchs avant la date du match spécifiée.
    
    Paramètres:
    df_games (DataFrame) : DataFrame des matchs.
    club_id (int) : ID du club.
    date_du_match (str ou pd.Timestamp) : Date du match pour lequel la forme est calculée.
    lieu (str) : 'domicile', 'exterieur', ou 'tous' pour filtrer les matchs.
    
    Retourne:
    int : Les points accumulés par le club sur ses 5 derniers matchs.
    """
    # Filtrer les matchs précédents et trier par date
    matchs_precedents = last_five_games(df_games, club_id, date_du_match, lieu)
    
    # Calculer les points (exemple simplifié)
    points = 0
    for _, row in matchs_precedents.iterrows():
        if row['home_club_id'] == club_id:
            points += 3 if row['home_club_goals'] > row['away_club_goals'] else 1 if row['home_club_goals'] == row['away_club_goals'] else 0
        else:
            points += 3 if row['away_club_goals'] > row['home_club_goals'] else 1 if row['away_club_goals'] == row['home_club_goals'] else 0
    
    return points


import pandas as pd 

def games_of_the_season(df_games, club_id, saison, lieu='tous'):
    """
    Récupère tous les matchs d'une saison pour un club spécifié, ou les 10 derniers matchs si moins de 5 matchs dans la saison.
    
    Paramètres:
    df_games (DataFrame) : DataFrame des matchs.
    club_id (int) : ID du club.
    saison (str) : Saison à filtrer.
    lieu (str) : 'domicile', 'exterieur', ou 'tous' pour filtrer les matchs.
    
    Retourne:
    DataFrame : Les matchs demandés avec les informations détaillées.
    """
    # Filtrage initial par saison et lieu
    if lieu == 'domicile':
        matchs_du_club = df_games[(df_games['home_club_id'] == club_id) & (df_games['season'] == saison)]
    elif lieu == 'exterieur':
        matchs_du_club = df_games[(df_games['away_club_id'] == club_id) & (df_games['season'] == saison)]
    else:
        matchs_du_club = df_games[((df_games['home_club_id'] == club_id) | (df_games['away_club_id'] == club_id)) & (df_games['season'] == saison)]
    
    # Vérification du nombre de matchs
    if len(matchs_du_club) < 5:
        # Prendre les 10 derniers matchs toutes saisons confondues si moins de 5 matchs dans la saison
        matchs_du_club = df_games[(df_games['home_club_id'] == club_id) | (df_games['away_club_id'] == club_id)]
        matchs_du_club = matchs_du_club.sort_values(by='date', ascending=False).head(10)
    else:
        # Trier par date
        matchs_du_club = matchs_du_club.sort_values(by='date', ascending=False)

    # Ajout des informations supplémentaires
    matchs_du_club['adversaire_id'] = matchs_du_club.apply(lambda row: row['away_club_id'] if row['home_club_id'] == club_id else row['home_club_id'], axis=1)
    matchs_du_club['lieu'] = matchs_du_club.apply(lambda row: 'domicile' if row['home_club_id'] == club_id else 'exterieur', axis=1)
    matchs_du_club['résultat'] = matchs_du_club.apply(lambda row: 'victoire' if (row['home_club_id'] == club_id and row['home_club_goals'] > row['away_club_goals']) or (row['away_club_id'] == club_id and row['away_club_goals'] > row['home_club_goals']) else 'défaite' if (row['home_club_id'] == club_id and row['home_club_goals'] < row['away_club_goals']) or (row['away_club_id'] == club_id and row['away_club_goals'] < row['home_club_goals']) else 'nul', axis=1)

    return matchs_du_club[['date', 'season', 'home_club_id', 'away_club_id', 'adversaire_id', 'lieu', 'home_club_goals', 'away_club_goals', 'résultat']]

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

def calculer_forme(df_games, club_id, type):
    """Calcule la forme d'un club sur ses n derniers matchs avant la date du match."""
    # Filtrer les matchs précédents et trier par date
    matchs_precedents = games_of_the_season(df_games, club_id, 2022, type)
    
    # Calculer les points (exemple simplifié)
    points = 0
    for _, row in matchs_precedents.iterrows():
        if row['home_club_id'] == club_id:
            points += 3 if row['home_club_goals'] > row['away_club_goals'] else 1 if row['home_club_goals'] == row['away_club_goals'] else 0
        else:
            points += 3 if row['away_club_goals'] > row['home_club_goals'] else 1 if row['away_club_goals'] == row['home_club_goals'] else 0
    
    return points

#last game id 
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
    # Filtrer pour obtenir les lignes correspondant au match_id, club_id et type 'starting_lineup'
    lineup_du_match = df_game_lineups[(df_game_lineups['game_id'] == match_id) & 
                                      (df_game_lineups['club_id'] == club_id) & 
                                      (df_game_lineups['type'] == 'starting_lineup')]
    
    # Récupérer les player_id
    joueurs = lineup_du_match['player_id'].tolist()

    return joueurs

def preparer_caracteristiques_match(df_games, df_players, df_game_lineups, home_team, away_team):
    home_forme = calculer_forme(df_games, home_team, "domicile")
    away_forme = calculer_forme(df_games, away_team, "exterieur")
    home_valeur_marchande = mean_team_value(df_players, starting_lineup_match(df_game_lineups, last_game_id(df_games, home_team), home_team))
    away_valeur_marchande = mean_team_value(df_players, starting_lineup_match(df_game_lineups, last_game_id(df_games, away_team), away_team))
    
    df_features = pd.DataFrame([[home_team, away_team, home_forme, away_forme, home_valeur_marchande, away_valeur_marchande]], 
                               columns=['home_club_id', 'away_club_id', 'home_forme', 'away_forme', 'home_valeur_marchande', 'away_valeur_marchande'])
    
    return df_features[['home_forme', 'away_forme', 'home_valeur_marchande', 'away_valeur_marchande']]

def predire_probabilites(model, match_features):
    probas = model.predict_proba(match_features)
    return probas


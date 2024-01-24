from flask import Flask, jsonify, request
import os
import psycopg2
import pandas as pd
import joblib
import predictia_ml
from sqlalchemy import create_engine
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


def calculer_forme(df_games, club_id, type):
    """Calcule la forme d'un club sur ses n derniers matchs avant la date du match."""
    # Filtrer les matchs précédents et trier par date
    matchs_precedents = games_of_the_season(df_games, club_id, 2023, type)

    # Calculer les points (exemple simplifié)
    points = 0
    for _, row in matchs_precedents.iterrows():
        if row['home_club_id'] == club_id:
            points += 3 if row['home_club_goals'] > row['away_club_goals'] else 1 if row['home_club_goals'] == row['away_club_goals'] else 0
        else:
            points += 3 if row['away_club_goals'] > row['home_club_goals'] else 1 if row['away_club_goals'] == row['home_club_goals'] else 0

    return points


def calculer_classement(df_games, df_clubs, club_id_specifique, saison_specifique):
    # Assurez-vous d'avoir df_clubs et df_games définis avant cette fonction
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les clubs ayant le même championnat domestique et last_season spécifiée
    clubs_meme_championnat = df_clubs[(df_clubs['domestic_competition_id'] == championnat_domestique) & (df_clubs['last_season'] == saison_specifique)]

    # Filtrer les jeux en fonction du championnat domestique
    games_championnat_domestique = df_games[df_games['competition_id'] == championnat_domestique]

    # Créer un tableau pour stocker les résultats du classement
    classement_tableau = []

    # Parcourir tous les clubs du même championnat
    for _, club_row in clubs_meme_championnat.iterrows():
        current_club_id = club_row['club_id']

        # Calculer la forme du club pour la saison spécifiée et le championnat spécifié
        points = calculer_forme(games_championnat_domestique, current_club_id, 'tous')

        # Ajouter les résultats au tableau
        classement_tableau.append({'club_id': current_club_id, 'points': points})

    # Créer un DataFrame à partir du tableau
    df_classement = pd.DataFrame(classement_tableau)

    # Trier le DataFrame en fonction des points pour obtenir le classement
    df_classement = df_classement.sort_values(by='points', ascending=False).reset_index(drop=True)

    # Trouver la position du club spécifié dans le classement
    position_club = df_classement[df_classement['club_id'] == club_id_specifique].index[0] + 1

    data = {
        'points': [df_classement[df_classement['club_id'] == club_id_specifique]['points'].iloc[0]],
        'position': [position_club]
    }

    result = pd.DataFrame(data)
    return result

def calculer_buts_marques(df_clubs, df_games, club_id_specifique, saison_specifique):
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les clubs ayant le même championnat domestique et last_season spécifiée
    clubs_meme_championnat = df_clubs[(df_clubs['domestic_competition_id'] == championnat_domestique) & (df_clubs['last_season'] == saison_specifique)]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Créer un tableau pour stocker les résultats des buts marqués par match
    buts_marques_tableau = []

    # Parcourir tous les clubs du même championnat
    for _, club_row in clubs_meme_championnat.iterrows():
        current_club_id = club_row['club_id']

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à domicile)
        matchs_du_club_domicile = games_championnat_domestique_saison[(games_championnat_domestique_saison['home_club_id'] == current_club_id)]

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à l'extérieur)
        matchs_du_club_exterieur = games_championnat_domestique_saison[(games_championnat_domestique_saison['away_club_id'] == current_club_id)]

        # Calculer le total des buts marqués à domicile
        total_buts_marques_domicile = matchs_du_club_domicile['home_club_goals'].sum()

        # Calculer le total des buts marqués à l'extérieur
        total_buts_marques_exterieur = matchs_du_club_exterieur['away_club_goals'].sum()

        # Calculer le total des buts marqués (totalité)
        total_buts_marques_total = total_buts_marques_domicile + total_buts_marques_exterieur

        # Ajouter les résultats au tableau
        buts_marques_tableau.append({'club_id': current_club_id, 'total_buts_marques_domicile': total_buts_marques_domicile, 'total_buts_marques_exterieur': total_buts_marques_exterieur, 'total_buts_marques_total': total_buts_marques_total})

    # Créer un DataFrame à partir du tableau
    df_buts_marques = pd.DataFrame(buts_marques_tableau)

    # Filtrer les résultats pour le club spécifié
    resultats_club_specifie = df_buts_marques[df_buts_marques['club_id'] == club_id_specifique]

    return resultats_club_specifie



def calculer_moyenne_buts_marques(df_clubs, df_games, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les clubs ayant le même championnat domestique et last_season spécifiée
    clubs_meme_championnat = df_clubs[(df_clubs['domestic_competition_id'] == championnat_domestique) & (df_clubs['last_season'] == saison_specifique)]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Créer un tableau pour stocker les résultats des buts marqués par match
    buts_marques_tableau = []

    # Parcourir tous les clubs du même championnat
    for _, club_row in clubs_meme_championnat.iterrows():
        current_club_id = club_row['club_id']
        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à domicile)
        matchs_du_club_domicile = games_championnat_domestique_saison[(games_championnat_domestique_saison['home_club_id'] == current_club_id)]
        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à l'extérieur)
        matchs_du_club_exterieur = games_championnat_domestique_saison[(games_championnat_domestique_saison['away_club_id'] == current_club_id)]

        # Calculer le nombre de matchs à domicile
        nb_matchs_domicile = len(matchs_du_club_domicile)

        # Calculer le nombre de matchs à l'extérieur
        nb_matchs_exterieur = len(matchs_du_club_exterieur)

        # Calculer le nombre total de matchs
        nb_matchs_total = nb_matchs_domicile + nb_matchs_exterieur

        # Calculer le total des buts marqués à domicile
        total_buts_marques_domicile = matchs_du_club_domicile['home_club_goals'].sum()

        # Calculer le total des buts marqués à l'extérieur
        total_buts_marques_exterieur = matchs_du_club_exterieur['away_club_goals'].sum()

        # Calculer le total des buts marqués (totalité)
        total_buts_marques_total = total_buts_marques_domicile + total_buts_marques_exterieur

        # Calculer la moyenne des buts marqués par match à domicile
        moyenne_buts_marques_domicile = total_buts_marques_domicile / nb_matchs_domicile if nb_matchs_domicile > 0 else 0

        # Calculer la moyenne des buts marqués par match à l'extérieur
        moyenne_buts_marques_exterieur = total_buts_marques_exterieur / nb_matchs_exterieur if nb_matchs_exterieur > 0 else 0

        # Calculer la moyenne des buts marqués par match (totalité)
        moyenne_buts_marques_total = total_buts_marques_total / nb_matchs_total if nb_matchs_total > 0 else 0

        # Ajouter les résultats au tableau
        buts_marques_tableau.append({'club_id': current_club_id, 'moyenne_buts_marques_domicile': moyenne_buts_marques_domicile, 'moyenne_buts_marques_exterieur': moyenne_buts_marques_exterieur, 'moyenne_buts_marques_total': moyenne_buts_marques_total})

    # Créer un DataFrame à partir du tableau
    df_buts_marques = pd.DataFrame(buts_marques_tableau)

    # Filtrer les résultats pour le club spécifié
    resultats_club_specifie = df_buts_marques[df_buts_marques['club_id'] == club_id_specifique]

    return resultats_club_specifie




def calculer_total_buts_encaisses(df_clubs, df_games, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les clubs ayant le même championnat domestique et last_season spécifiée
    clubs_meme_championnat = df_clubs[(df_clubs['domestic_competition_id'] == championnat_domestique) & (df_clubs['last_season'] == saison_specifique)]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Créer un tableau pour stocker les résultats des buts encaissés par match
    buts_encaisses_tableau = []

    # Parcourir tous les clubs du même championnat
    for _, club_row in clubs_meme_championnat.iterrows():
        current_club_id = club_row['club_id']

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à domicile)
        matchs_du_club_domicile = games_championnat_domestique_saison[(games_championnat_domestique_saison['home_club_id'] == current_club_id)]

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à l'extérieur)
        matchs_du_club_exterieur = games_championnat_domestique_saison[(games_championnat_domestique_saison['away_club_id'] == current_club_id)]

        # Calculer le total des buts encaissés à domicile
        total_buts_encaisses_domicile = matchs_du_club_domicile['away_club_goals'].sum()

        # Calculer le total des buts encaissés à l'extérieur
        total_buts_encaisses_exterieur = matchs_du_club_exterieur['home_club_goals'].sum()

        # Calculer le total des buts encaissés (totalité)
        total_buts_encaisses_total = total_buts_encaisses_domicile + total_buts_encaisses_exterieur

        # Ajouter les résultats au tableau
        buts_encaisses_tableau.append({'club_id': current_club_id, 'total_buts_encaisses_domicile': total_buts_encaisses_domicile, 'total_buts_encaisses_exterieur': total_buts_encaisses_exterieur, 'total_buts_encaisses_total': total_buts_encaisses_total})

    # Créer un DataFrame à partir du tableau
    df_buts_encaisses = pd.DataFrame(buts_encaisses_tableau)

    # Filtrer les résultats pour le club spécifié
    resultats_club_specifie = df_buts_encaisses[df_buts_encaisses['club_id'] == club_id_specifique]

    return resultats_club_specifie


def calculer_moyenne_buts_encaisses(df_clubs, df_games, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les clubs ayant le même championnat domestique et last_season spécifiée
    clubs_meme_championnat = df_clubs[(df_clubs['domestic_competition_id'] == championnat_domestique) & (df_clubs['last_season'] == saison_specifique)]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Créer un tableau pour stocker les résultats des buts marqués par match
    buts_encaisses_tableau = []

    # Parcourir tous les clubs du même championnat
    for _, club_row in clubs_meme_championnat.iterrows():
        current_club_id = club_row['club_id']
        matchs_du_club_domicile = games_championnat_domestique_saison[(games_championnat_domestique_saison['home_club_id'] == current_club_id)]
        matchs_du_club_exterieur = games_championnat_domestique_saison[(games_championnat_domestique_saison['away_club_id'] == current_club_id)]

        nb_matchs_domicile = len(matchs_du_club_domicile)

        nb_matchs_exterieur = len(matchs_du_club_exterieur)

        nb_matchs_total = nb_matchs_domicile + nb_matchs_exterieur

        total_buts_encaisses_domicile = matchs_du_club_domicile['away_club_goals'].sum()

        total_buts_encaisses_exterieur = matchs_du_club_exterieur['home_club_goals'].sum()

        total_buts_encaisses_total = total_buts_encaisses_domicile + total_buts_encaisses_exterieur

        moyenne_buts_encaisses_domicile = total_buts_encaisses_domicile / nb_matchs_domicile if nb_matchs_domicile > 0 else 0

        moyenne_buts_encaisses_exterieur = total_buts_encaisses_exterieur / nb_matchs_exterieur if nb_matchs_exterieur > 0 else 0

        moyenne_buts_encaisses_total = total_buts_encaisses_total / nb_matchs_total if nb_matchs_total > 0 else 0

        buts_encaisses_tableau.append({'club_id': current_club_id, 'moyenne_buts_marques_domicile': moyenne_buts_encaisses_domicile, 'moyenne_buts_marques_exterieur': moyenne_buts_encaisses_exterieur, 'moyenne_buts_marques_total': moyenne_buts_encaisses_total})

    # Créer un DataFrame à partir du tableau
    df_buts_marques = pd.DataFrame(buts_encaisses_tableau)

    # Filtrer les résultats pour le club spécifié
    resultats_club_specifie = df_buts_marques[df_buts_marques['club_id'] == club_id_specifique]

    return resultats_club_specifie

def calculer_nombre_victoires(df_clubs, df_games, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les clubs ayant le même championnat domestique et last_season spécifiée
    clubs_meme_championnat = df_clubs[(df_clubs['domestic_competition_id'] == championnat_domestique) & (df_clubs['last_season'] == saison_specifique)]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Créer un tableau pour stocker les résultats du nombre de victoires à domicile et à l'extérieur
    victoires_tableau = []

    # Parcourir tous les clubs du même championnat
    for _, club_row in clubs_meme_championnat.iterrows():
        current_club_id = club_row['club_id']

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à domicile)
        matchs_du_club_domicile = games_championnat_domestique_saison[(games_championnat_domestique_saison['home_club_id'] == current_club_id)]

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à l'extérieur)
        matchs_du_club_exterieur = games_championnat_domestique_saison[(games_championnat_domestique_saison['away_club_id'] == current_club_id)]

        # Compter le nombre de victoires à domicile
        victoires_domicile = len(matchs_du_club_domicile[matchs_du_club_domicile['home_club_goals'] > matchs_du_club_domicile['away_club_goals']])

        # Compter le nombre de victoires à l'extérieur
        victoires_exterieur = len(matchs_du_club_exterieur[matchs_du_club_exterieur['away_club_goals'] > matchs_du_club_exterieur['home_club_goals']])

        # Ajouter les résultats au tableau
        victoires_tableau.append({'club_id': current_club_id, 'victoires_domicile': victoires_domicile, 'victoires_exterieur': victoires_exterieur})

    # Créer un DataFrame à partir du tableau
    df_victoires = pd.DataFrame(victoires_tableau)

    # Filtrer les résultats pour le club spécifié
    resultats_club_specifie = df_victoires[df_victoires['club_id'] == club_id_specifique]

    return resultats_club_specifie


def calculer_nombre_defaites(df_clubs, df_games, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les clubs ayant le même championnat domestique et last_season spécifiée
    clubs_meme_championnat = df_clubs[(df_clubs['domestic_competition_id'] == championnat_domestique) & (df_clubs['last_season'] == saison_specifique)]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Créer un tableau pour stocker les résultats du nombre de défaites à domicile et à l'extérieur
    defaites_tableau = []

    # Parcourir tous les clubs du même championnat
    for _, club_row in clubs_meme_championnat.iterrows():
        current_club_id = club_row['club_id']

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à domicile)
        matchs_du_club_domicile = games_championnat_domestique_saison[(games_championnat_domestique_saison['home_club_id'] == current_club_id)]

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié (à l'extérieur)
        matchs_du_club_exterieur = games_championnat_domestique_saison[(games_championnat_domestique_saison['away_club_id'] == current_club_id)]

        # Compter le nombre de défaites à domicile
        defaites_domicile = len(matchs_du_club_domicile[matchs_du_club_domicile['home_club_goals'] < matchs_du_club_domicile['away_club_goals']])

        # Compter le nombre de défaites à l'extérieur
        defaites_exterieur = len(matchs_du_club_exterieur[matchs_du_club_exterieur['away_club_goals'] < matchs_du_club_exterieur['home_club_goals']])

        # Ajouter les résultats au tableau
        defaites_tableau.append({'club_id': current_club_id, 'defaites_domicile': defaites_domicile, 'defaites_exterieur': defaites_exterieur})

    # Créer un DataFrame à partir du tableau
    df_defaites = pd.DataFrame(defaites_tableau)

    # Filtrer les résultats pour le club spécifié
    resultats_club_specifie = df_defaites[df_defaites['club_id'] == club_id_specifique]

    return resultats_club_specifie


def calculer_forme_5_derniers_matchs(df_clubs, df_games, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les clubs ayant le même championnat domestique et last_season spécifiée
    clubs_meme_championnat = df_clubs[(df_clubs['domestic_competition_id'] == championnat_domestique) & (df_clubs['last_season'] == saison_specifique)]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Créer un tableau pour stocker les résultats du nombre de victoires et de défaites sur les 5 derniers matchs
    forme_tableau = []

    # Parcourir tous les clubs du même championnat
    for _, club_row in clubs_meme_championnat.iterrows():
        current_club_id = club_row['club_id']

        # Filtrer les matchs de la saison spécifiée impliquant le club spécifié
        matchs_du_club = games_championnat_domestique_saison[(games_championnat_domestique_saison['home_club_id'] == current_club_id) | (games_championnat_domestique_saison['away_club_id'] == current_club_id)]

        # Trier les matchs par date de manière décroissante
        matchs_du_club = matchs_du_club.sort_values(by='date', ascending=False)

        # Sélectionner les 5 derniers matchs
        cinq_derniers_matchs = matchs_du_club.head(5)

        # Compter le nombre de victoires et de défaites sur les 5 derniers matchs
        victoires = 0
        defaites = 0
        nul = 0

        for _, match_row in cinq_derniers_matchs.iterrows():
            if match_row['home_club_id'] == current_club_id:
                if match_row['home_club_goals'] > match_row['away_club_goals']:
                    victoires += 1
                elif match_row['home_club_goals'] < match_row['away_club_goals']:
                    defaites += 1
                elif match_row['home_club_goals'] == match_row['away_club_goals']:
                    nul += 1
            elif match_row['away_club_id'] == current_club_id:
                if match_row['away_club_goals'] > match_row['home_club_goals']:
                    victoires += 1
                elif match_row['away_club_goals'] < match_row['home_club_goals']:
                    defaites += 1
                elif match_row['home_club_goals'] == match_row['away_club_goals']:
                    nul += 1

        # Ajouter les résultats au tableau
        forme_tableau.append({'club_id': current_club_id, 'victoires_5_derniers': victoires, 'defaites_5_derniers': defaites, 'nul_5_derniers': nul})

    # Créer un DataFrame à partir du tableau
    df_forme = pd.DataFrame(forme_tableau)

    # Filtrer les résultats pour le club spécifié
    resultats_club_specifie = df_forme[df_forme['club_id'] == club_id_specifique]

    return resultats_club_specifie



def calculer_cartons_jaunes_pour_club(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique):
    pd.set_option('display.max_columns', None)
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Filtrer les événements de jeu liés aux matchs de la saison spécifiée dans le même championnat
    events_championnat_saison = df_game_events[df_game_events['game_id'].isin(games_championnat_domestique_saison['game_id'])]

    
    # Filtrer les événements de jeu qui sont des cartons jaunes pour le club spécifié
    cartons_jaunes_club_specifique = events_championnat_saison[(events_championnat_saison['club_id'] == club_id_specifique) &
                                                              (events_championnat_saison['description'].str.contains("Yellow card"))]

    # Compter le nombre de cartons jaunes pour le club spécifié
    nombre_cartons_jaunes_club_specifique = len(cartons_jaunes_club_specifique)

    return nombre_cartons_jaunes_club_specifique



def calculer_moyenne_cartons_jaunes_par_match(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Filtrer les événements de jeu liés aux matchs de la saison spécifiée dans le même championnat
    events_championnat_saison = df_game_events[df_game_events['game_id'].isin(games_championnat_domestique_saison['game_id'])]

    # Filtrer les événements de jeu qui sont des cartons jaunes pour le club spécifié
    cartons_jaunes_club_specifique = events_championnat_saison[(events_championnat_saison['club_id'] == club_id_specifique) & 
                                                                (events_championnat_saison['description'].str.contains("Yellow card"))]

    # Calculer le nombre total de matchs joués par le club spécifié à domicile
    df_nombres_matchs_home = games_championnat_domestique_saison[games_championnat_domestique_saison['home_club_id'] == club_id_specifique]
    nombre_matchs_home = len(df_nombres_matchs_home)

    # Calculer le nombre total de matchs joués par le club spécifié à l'extérieur
    df_nombres_matchs_away = games_championnat_domestique_saison[games_championnat_domestique_saison['away_club_id'] == club_id_specifique]
    nombre_matchs_away = len(df_nombres_matchs_away)

    # Calculer le nombre total de matchs joués par le club spécifié
    nombre_matchs_total = nombre_matchs_home + nombre_matchs_away

    # Calculer le nombre total de cartons jaunes pour le club spécifié
    nombre_cartons_jaunes_club_specifique = len(cartons_jaunes_club_specifique)

    # Calculer la moyenne de cartons jaunes par match pour le club spécifié
    moyenne_cartons_jaunes_par_match = nombre_cartons_jaunes_club_specifique / nombre_matchs_total

    return moyenne_cartons_jaunes_par_match


def calculer_nombre_cartons_rouges_par_club(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Filtrer les événements de jeu liés aux matchs de la saison spécifiée dans le même championnat
    events_championnat_saison = df_game_events[df_game_events['game_id'].isin(games_championnat_domestique_saison['game_id'])]

    # Filtrer les événements de jeu qui sont des cartons rouges pour le club spécifié
    cartons_rouges_club_specifique = events_championnat_saison[(events_championnat_saison['club_id'] == club_id_specifique) & 
                                                               (events_championnat_saison['description'].str.contains("Red card"))]

    # Calculer le nombre total de cartons rouges pour le club spécifié
    nombre_cartons_rouges_club_specifique = len(cartons_rouges_club_specifique)

    return nombre_cartons_rouges_club_specifique


def calculer_cartons_rouges_et_moyenne_pour_club(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Filtrer les événements de jeu liés aux matchs de la saison spécifiée dans le même championnat
    events_championnat_saison = df_game_events[df_game_events['game_id'].isin(games_championnat_domestique_saison['game_id'])]

    # Filtrer les événements de jeu qui sont des cartons rouges pour le club spécifié
    cartons_rouges_club_specifique = events_championnat_saison[(events_championnat_saison['club_id'] == club_id_specifique) & (events_championnat_saison['description'].str.contains("Red card"))]

    # Calculer le nombre total de cartons rouges pour le club spécifié
    nombre_cartons_rouges_club_specifique = len(cartons_rouges_club_specifique)

    # Calculer le nombre total de matchs joués par le club à domicile dans la saison 2023
    nombre_matchs_home_club_specifique = games_championnat_domestique_saison[games_championnat_domestique_saison['home_club_id'] == club_id_specifique].shape[0]

    # Calculer le nombre total de matchs joués par le club à l'extérieur dans la saison 2023
    nombre_matchs_away_club_specifique = games_championnat_domestique_saison[games_championnat_domestique_saison['away_club_id'] == club_id_specifique].shape[0]

    # Calculer le nombre total de matchs joués par le club dans la saison 2023
    nombre_matchs_total_club_specifique = nombre_matchs_home_club_specifique + nombre_matchs_away_club_specifique

    # Calculer la moyenne de cartons rouges par match pour le club spécifié
    moyenne_cartons_rouges_par_match_club_specifique = nombre_cartons_rouges_club_specifique / nombre_matchs_total_club_specifique

    # Créer un DataFrame avec les résultats
    resultat_df = pd.DataFrame({
        'club_id': [club_id_specifique],
        'nombre_cartons_rouges': [nombre_cartons_rouges_club_specifique],
        'nombre_matchs_total': [nombre_matchs_total_club_specifique],
        'moyenne_cartons_rouges_par_match': [moyenne_cartons_rouges_par_match_club_specifique]
    })

    return resultat_df



def calculer_matchs_avec_buts_pour_club(df_clubs, df_games, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Filtrer les matchs impliquant le club spécifié pour la saison spécifiée
    matchs_du_club_domicile = games_championnat_domestique_saison[games_championnat_domestique_saison['home_club_id'] == club_id_specifique]
    matchs_du_club_exterieur = games_championnat_domestique_saison[games_championnat_domestique_saison['away_club_id'] == club_id_specifique]

    # Filtrer les matchs avec au moins un but marqué par l'équipe
    matchs_avec_buts = pd.concat([
        matchs_du_club_domicile[matchs_du_club_domicile['home_club_goals'] > 0],
        matchs_du_club_exterieur[matchs_du_club_exterieur['away_club_goals'] > 0]
    ])

    # Calculer le nombre de matchs avec au moins un but marqué par l'équipe
    nombre_matchs_avec_buts = len(matchs_avec_buts)

    # Créer un DataFrame avec les résultats
    resultat_df = pd.DataFrame({
        'club_id': [club_id_specifique],
        'nombre_matchs_avec_buts': [nombre_matchs_avec_buts]
    })

    return resultat_df



def calculer_matchs_avec_buts_encaisses_pour_club(df_clubs, df_games, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les jeux en fonction du championnat domestique et de la saison spécifiée
    games_championnat_domestique_saison = df_games[(df_games['competition_id'] == championnat_domestique) & (df_games['season'] == saison_specifique)]

    # Filtrer les matchs impliquant le club spécifié pour la saison spécifiée
    matchs_du_club_domicile = games_championnat_domestique_saison[games_championnat_domestique_saison['home_club_id'] == club_id_specifique]
    matchs_du_club_exterieur = games_championnat_domestique_saison[games_championnat_domestique_saison['away_club_id'] == club_id_specifique]

    # Filtrer les matchs avec au moins un but encaissé par l'équipe
    matchs_avec_buts_encaisses = pd.concat([
        matchs_du_club_domicile[matchs_du_club_domicile['away_club_goals'] > 0],
        matchs_du_club_exterieur[matchs_du_club_exterieur['home_club_goals'] > 0]
    ])

    # Calculer le nombre de matchs avec au moins un but encaissé par l'équipe
    nombre_matchs_avec_buts_encaisses = len(matchs_avec_buts_encaisses)

    # Créer un DataFrame avec les résultats
    resultat_df = pd.DataFrame({
        'club_id': [club_id_specifique],
        'nombre_matchs_avec_buts_encaisses': [nombre_matchs_avec_buts_encaisses]
    })

    return resultat_df

def calculer_minute_moyenne_premier_but_pour_club(df_clubs, df_games, df_game_events, club_id_specifique, saison_specifique):
    # Récupérez le championnat domestique de l'équipe spécifiée
    championnat_domestique = df_clubs[df_clubs['club_id'] == club_id_specifique]['domestic_competition_id'].iloc[0]

    # Filtrer les matchs impliquant le club spécifié pour la saison spécifiée
    matchs_du_club_2023 = df_games[
        (df_games['competition_id'] == championnat_domestique)
        & (df_games['season'] == saison_specifique)
        & ((df_games['home_club_id'] == club_id_specifique) | (df_games['away_club_id'] == club_id_specifique))
    ]

    # Créer un tableau pour stocker les résultats des minutes du premier but par équipe
    minutes_premier_but_tableau = []

    # Pour chaque match, vérifier s'il y a des buts et enregistrer la minute du premier but
    for _, match_row in matchs_du_club_2023.iterrows():
        game_id = match_row['game_id']
        events_du_match = df_game_events[
            (df_game_events['game_id'] == str(game_id))
            & (df_game_events['type'] == 'Goals')
            & (df_game_events['club_id'] == club_id_specifique)
        ]

        if not events_du_match.empty:
            # Prendre la minute du premier but et l'ajouter au tableau
            minute_premier_but = events_du_match['minute'].min()
            minutes_premier_but_tableau.append(
                {'club_id': club_id_specifique, 'minute_premier_but': minute_premier_but, 'game_id': game_id}
            )

    # Créer un DataFrame à partir du tableau
    df_minutes_premier_but = pd.DataFrame(minutes_premier_but_tableau)

    # Calculer la minute moyenne du premier but
    minute_moyenne_premier_but = df_minutes_premier_but['minute_premier_but'].mean()

    return minute_moyenne_premier_but

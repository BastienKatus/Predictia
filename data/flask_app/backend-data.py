from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

# Remplacez par vos détails de connexion PostgreSQL
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_USER = 'admin'
DB_PASSWORD = 'admin'
DB_NAME = 'predictia'

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

# Endpoint pour récupérer tous les joueurs
@app.route('/players', methods=['GET'])
def get_players():
    query = "SELECT * FROM players;"
    data = execute_query(query)
    return jsonify(data)


# Renommez les autres endpoints pour suivre les conventions REST

@app.route('/club_games', methods=['GET'])
def get_club_games():
    query = "SELECT * FROM club_games;"
    data = execute_query(query)
    return jsonify(data)

@app.route('/clubs', methods=['GET'])
def get_clubs():
    query = "SELECT * FROM clubs;"
    data = execute_query(query)
    return jsonify(data)

@app.route('/competitions', methods=['GET'])
def get_competitions():
    query = "SELECT * FROM competitions;"
    data = execute_query(query)
    return jsonify(data)

@app.route('/game_events', methods=['GET'])
def get_game_events():
    query = "SELECT * FROM game_events;"
    data = execute_query(query)
    return jsonify(data)

@app.route('/game_lineups', methods=['GET'])
def get_game_lineups():
    query = "SELECT * FROM game_lineups;"
    data = execute_query(query)
    return jsonify(data)

@app.route('/games', methods=['GET'])
def get_games():
    query = "SELECT * FROM games;"
    data = execute_query(query)
    return jsonify(data)

@app.route('/player_valuations', methods=['GET'])
def get_player_valuations():
    query = "SELECT * FROM player_valuations;"
    data = execute_query(query)
    return jsonify(data)

@app.route('/appearances', methods=['GET'])
def get_appearances():
    query = "SELECT * FROM appearances;"
    data = execute_query(query)
    return jsonify(data)

@app.route('/player_valuations/club/<string:player_id>', methods=['GET'])
def get_player_valuations_by_id(player_id):
    query = "SELECT * FROM player_valuations WHERE player_id = %s;"
    data = execute_query(query, (player_id,))
    if not data:
        return jsonify({'error': 'Player valuation not found'}), 404
    return jsonify(data[0])

@app.route('/players/<string:player_id>', methods=['GET'])
def get_player_by_id(player_id):
    query = "SELECT * FROM players WHERE player_id = %s;"
    data = execute_query(query, (player_id,))
    if not data:
        return jsonify({'error': 'Player not found'}), 404
    return jsonify(data[0])

@app.route('/club_games/club/<string:club_id>', methods=['GET'])
def get_club_game_by_club_id(club_id):
    query = "SELECT * FROM club_games WHERE club_id = %s;"
    data = execute_query(query, (club_id,))
    if not data:
        return jsonify({'error': 'Club game not found'}), 404
    return jsonify(data[0])

@app.route('/club_games/<string:game_id>', methods=['GET'])
def get_club_game_by_game_id(game_id):
    query = "SELECT * FROM club_games WHERE game_id = %s;"
    data = execute_query(query, (game_id,))
    if not data:
        return jsonify({'error': 'Club game not found'}), 404
    return jsonify(data[0])

@app.route('/game_events/<string:game_event_id>', methods=['GET'])
def get_game_event_by_id(game_event_id):
    query = "SELECT * FROM game_events WHERE game_event_id = %s;"
    data = execute_query(query, (game_event_id,))
    if not data:
        return jsonify({'error': 'Game event not found'}), 404
    return jsonify(data[0])

@app.route('/appearances/<string:appearance_id>', methods=['GET'])
def get_appearance_by_id(appearance_id):
    query = "SELECT * FROM appearances WHERE appearance_id = %s;"
    data = execute_query(query, (appearance_id,))
    if not data:
        return jsonify({'error': 'Appearance not found'}), 404
    return jsonify(data[0])

@app.route('/game_lineups/<string:game_lineups_id>', methods=['GET'])
def get_game_lineups_by_id(game_lineups_id):
    query = "SELECT * FROM game_lineups WHERE game_lineups_id = %s;"
    data = execute_query(query, (game_lineups_id,))
    if not data:
        return jsonify({'error': 'Game lineup not found'}), 404
    return jsonify(data[0])


@app.route('/games/<string:game_id>', methods=['GET'])
def get_game_by_id(game_id):
    query = "SELECT * FROM games WHERE game_id = %s;"
    data = execute_query(query, (game_id,))
    if not data:
        return jsonify({'error': 'Game not found'}), 404
    return jsonify(data[0])

@app.route('/competitions/<string:competition_id>', methods=['GET'])
def get_competition_by_id(competition_id):
    query = "SELECT * FROM competitions WHERE competition_id = %s;"
    data = execute_query(query, (competition_id,))
    if not data:
        return jsonify({'error': 'Competition not found'}), 404
    return jsonify(data[0])

@app.route('/clubs/<string:club_id>', methods=['GET'])
def get_club_by_id(club_id):
    query = "SELECT * FROM clubs WHERE club_id = %s;"
    data = execute_query(query, (club_id,))
    if not data:
        return jsonify({'error': 'Club not found'}), 404
    return jsonify(data[0])

if __name__ == '__main__':
    app.run(debug=True, port=5000)

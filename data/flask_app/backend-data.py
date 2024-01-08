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

# Endpoint pour récupérer un joueur spécifique par ID
@app.route('/players/<int:player_id>', methods=['GET'])
def get_player_by_id(player_id):
    query = "SELECT * FROM players WHERE player_id = %s;"
    data = execute_query(query, (player_id,))
    if not data:
        return jsonify({'error': 'Player not found'}), 404
    return jsonify(data[0])

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)

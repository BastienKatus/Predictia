from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

# Replace with your PostgreSQL connection details
DB_HOST = 'localhost'
DB_PORT = '5432'
DB_USER = 'admin'
DB_PASSWORD = 'admin'
DB_NAME = 'predictia'

def execute_query(query):
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )

        cursor = connection.cursor()
        cursor.execute(query)
        data = cursor.fetchall()

        cursor.close()
        connection.close()

        return data

    except Exception as e:
        return {'error': str(e)}

# Endpoint to retrieve data from the 'club_games' table
@app.route('/get_club_games', methods=['GET'])
def get_club_games():
    query = "SELECT * FROM club_games;"
    data = execute_query(query)
    return jsonify(data)

# Endpoint to retrieve data from the 'clubs' table
@app.route('/get_clubs', methods=['GET'])
def get_clubs():
    query = "SELECT * FROM clubs;"
    data = execute_query(query)
    return jsonify(data)

# Endpoint to retrieve data from the 'competitions' table
@app.route('/get_competitions', methods=['GET'])
def get_competitions():
    query = "SELECT * FROM competitions;"
    data = execute_query(query)
    return jsonify(data)

# Endpoint to retrieve data from the 'game_events' table
@app.route('/get_game_events', methods=['GET'])
def get_game_events():
    query = "SELECT * FROM game_events;"
    data = execute_query(query)
    return jsonify(data)

# Endpoint to retrieve data from the 'game_lineups' table
@app.route('/get_game_lineups', methods=['GET'])
def get_game_lineups():
    query = "SELECT * FROM game_lineups;"
    data = execute_query(query)
    return jsonify(data)

# Endpoint to retrieve data from the 'games' table
@app.route('/get_games', methods=['GET'])
def get_games():
    query = "SELECT * FROM games;"
    data = execute_query(query)
    return jsonify(data)

# Endpoint to retrieve data from the 'player_valuations' table
@app.route('/get_player_valuations', methods=['GET'])
def get_player_valuations():
    query = "SELECT * FROM player_valuations;"
    data = execute_query(query)
    return jsonify(data)

# Endpoint to retrieve data from the 'players' table
@app.route('/get_players', methods=['GET'])
def get_players():
    query = "SELECT * FROM players;"
    data = execute_query(query)
    return jsonify(data)

# Endpoint to retrieve data from the 'appearances' table
@app.route('/get_appearances', methods=['GET'])
def get_appearances():
    query = "SELECT * FROM appearances;"
    data = execute_query(query)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

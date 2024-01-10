CREATE TABLE club_games (
    game_id INTEGER,
    club_id INTEGER,
    own_goals INTEGER NULL,
    own_position INTEGER NULL,
    own_manager_name TEXT NULL,
    opponent_id INTEGER NULL,
    opponent_goals INTEGER NULL,
    opponent_position INTEGER NULL,
    opponent_manager_name TEXT NULL,
    hosting TEXT NULL,
    is_win INTEGER NULL
);
COPY club_games
FROM '/csv_files/club_games.csv' DELIMITER ',' CSV HEADER;
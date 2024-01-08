CREATE TABLE club_games (
    game_id TEXT NULL,
    club_id TEXT NULL,
    own_goals TEXT NULL,
    own_position TEXT NULL,
    own_manager_name TEXT NULL,
    opponent_id TEXT NULL,
    opponent_goals TEXT NULL,
    opponent_position TEXT NULL,
    opponent_manager_name TEXT NULL,
    hosting TEXT NULL,
    is_win TEXT NULL
);
COPY club_games
FROM '/csv_files/club_games.csv' DELIMITER ',' CSV HEADER;
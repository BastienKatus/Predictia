CREATE TABLE games (
    game_id TEXT NULL,
    competition_id TEXT NULL,
    season TEXT NULL,
    round TEXT NULL,
    date TEXT NULL,
    home_club_id TEXT NULL,
    away_club_id TEXT NULL,
    home_club_goals TEXT NULL,
    away_club_goals TEXT NULL,
    home_club_position TEXT NULL,
    away_club_position TEXT NULL,
    home_club_manager_name TEXT NULL,
    away_club_manager_name TEXT NULL,
    stadium TEXT NULL,
    attendance TEXT NULL,
    referee TEXT NULL,
    url TEXT NULL,
    home_club_formation TEXT NULL,
    away_club_formation TEXT NULL,
    home_club_name TEXT NULL,
    away_club_name TEXT NULL,
    aggregate TEXT NULL,
    competition_type TEXT NULL
);
COPY games
FROM '/csv_files/games.csv' DELIMITER ',' CSV HEADER;
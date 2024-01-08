CREATE TABLE games (
    game_id INTEGER NULL,
    competition_id TEXT NULL,
    season INTEGER NULL,
    round TEXT NULL,
    date TEXT NULL,
    home_club_id INTEGER NULL,
    away_club_id INTEGER NULL,
    home_club_goals INTEGER NULL,
    away_club_goals INTEGER NULL,
    home_club_position INTEGER NULL,
    away_club_position INTEGER NULL,
    home_club_manager_name TEXT NULL,
    away_club_manager_name TEXT NULL,
    stadium TEXT NULL,
    attendance INTEGER NULL,
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
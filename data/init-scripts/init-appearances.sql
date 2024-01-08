CREATE TABLE appearances (
    appearance_id TEXT,
    game_id INTEGER,
    player_id INTEGER,
    player_club_id INTEGER,
    player_current_club_id INTEGER,
    date TEXT,
    player_name TEXT,
    competition_id TEXT,
    yellow_cards INTEGER,
    red_cards INTEGER,
    goals INTEGER,
    assists INTEGER,
    minutes_played INTEGER
);

COPY appearances
FROM '/csv_files/appearances.csv'
DELIMITER ',' 
CSV HEADER;

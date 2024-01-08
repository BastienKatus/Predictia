CREATE TABLE appearances (
    appearance_id TEXT,
    game_id TEXT,
    player_id TEXT,
    player_club_id TEXT,
    player_current_club_id TEXT,
    date TEXT,
    player_name TEXT,
    competition_id TEXT,
    yellow_cards TEXT,
    red_cards TEXT,
    goals TEXT,
    assists TEXT,
    minutes_played TEXT
);
COPY appearances
FROM '/csv_files/appearances.csv' DELIMITER ',' CSV HEADER;
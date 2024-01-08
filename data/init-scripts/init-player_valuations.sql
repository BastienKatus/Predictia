CREATE TABLE player_valuations (
    player_id INTEGER NULL,
    date TEXT NULL,
    datetime TEXT NULL,
    dateweek TEXT NULL,
    market_value_in_eur INTEGER NULL,
    current_club_id INTEGER NULL,
    player_club_domestic_competition_id TEXT NULL
);
COPY player_valuations
FROM '/csv_files/player_valuations.csv' DELIMITER ',' CSV HEADER;
CREATE TABLE players (
    player_id INTEGER NULL,
    first_name TEXT NULL,
    last_name TEXT NULL,
    name TEXT NULL,
    last_season INTEGER NULL,
    current_club_id INTEGER NULL,
    player_code TEXT NULL,
    country_of_birth TEXT NULL,
    city_of_birth TEXT NULL,
    country_of_citizenship TEXT NULL,
    date_of_birth TEXT NULL,
    sub_position TEXT NULL,
    position TEXT NULL,
    foot TEXT NULL,
    height_in_cm INTEGER NULL,
    contract_expiration_date TEXT NULL,
    agent_name TEXT NULL,
    image_url TEXT NULL,
    url TEXT NULL,
    current_club_domestic_competition_id TEXT NULL,
    current_club_name TEXT NULL,
    market_value_in_eur INTEGER NULL,
    highest_market_value_in_eur INTEGER NULL
);
COPY players
FROM '/csv_files/players.csv' DELIMITER ',' CSV HEADER;
CREATE TABLE clubs (
    club_id INTEGER,
    club_code TEXT NULL,
    name TEXT NULL,
    domestic_competition_id TEXT NULL,
    total_market_value TEXT NULL,
    squad_size INTEGER NULL,
    average_age TEXT NULL,
    foreigners_number INTEGER NULL,
    foreigners_percentage TEXT NULL,
    national_team_players INTEGER NULL,
    stadium_name TEXT NULL,
    stadium_seats INTEGER NULL,
    net_transfer_record TEXT NULL,
    coach_name TEXT NULL,
    last_season INTEGER NULL,
    filename TEXT NULL,
    url TEXT NULL
);
COPY clubs
FROM '/csv_files/clubs.csv' DELIMITER ',' CSV HEADER;
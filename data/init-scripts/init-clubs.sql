CREATE TABLE clubs (
    club_id TEXT NULL,
    club_code TEXT NULL,
    name TEXT NULL,
    domestic_competition_id TEXT NULL,
    total_market_value TEXT NULL,
    squad_size TEXT NULL,
    average_age TEXT NULL,
    foreigners_number TEXT NULL,
    foreigners_percentage TEXT NULL,
    national_team_players TEXT NULL,
    stadium_name TEXT NULL,
    stadium_seats TEXT NULL,
    net_transfer_record TEXT NULL,
    coach_name TEXT NULL,
    last_season TEXT NULL,
    filename TEXT NULL,
    url TEXT NULL
);
COPY clubs
FROM '/csv_files/clubs.csv' DELIMITER ',' CSV HEADER;
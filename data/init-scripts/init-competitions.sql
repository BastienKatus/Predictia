CREATE TABLE competitions (
    competition_id TEXT NULL,
    competition_code TEXT NULL,
    name TEXT NULL,
    sub_type TEXT NULL,
    type TEXT NULL,
    country_id TEXT NULL,
    country_name TEXT NULL,
    domestic_league_code TEXT NULL,
    confederation TEXT NULL,
    url TEXT NULL
);
COPY competitions
FROM '/csv_files/competitions.csv' DELIMITER ',' CSV HEADER;
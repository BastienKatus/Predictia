CREATE TABLE clubs_link_api (
    id INTEGER,
    name TEXT,
    shortName TEXT,
    tla TEXT,
    league_code TEXT,
    league_name TEXT,
    logo TEXT,
    id_soccer_manager INTEGER
);

COPY clubs_link_api
FROM '/csv_files/clubs_link_api.csv' DELIMITER ',' CSV HEADER;
CREATE TABLE game_events (
    game_event_id TEXT NULL,
    date TEXT NULL,
    game_id TEXT NULL,
    minute INTEGER NULL,
    type TEXT NULL,
    club_id INTEGER NULL,
    player_id INTEGER NULL,
    description TEXT NULL,
    player_in_id INTEGER NULL,
    player_assist_id INTEGER NULL
);
COPY game_events
FROM '/csv_files/game_events.csv' DELIMITER ',' CSV HEADER;
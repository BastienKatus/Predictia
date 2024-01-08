CREATE TABLE game_events (
    game_event_id TEXT NULL,
    date TEXT NULL,
    game_id TEXT NULL,
    minute TEXT NULL,
    type TEXT NULL,
    club_id TEXT NULL,
    player_id TEXT NULL,
    description TEXT NULL,
    player_in_id TEXT NULL,
    player_assist_id TEXT NULL
);
COPY game_events
FROM '/csv_files/game_events.csv' DELIMITER ',' CSV HEADER;
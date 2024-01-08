CREATE TABLE game_lineups (
    game_lineups_id TEXT NULL,
    game_id TEXT NULL,
    club_id TEXT NULL,
    type TEXT NULL,
    number TEXT NULL,
    player_id TEXT NULL,
    player_name TEXT NULL,
    team_captain TEXT NULL,
    position TEXT NULL
);
COPY game_lineups
FROM '/csv_files/game_lineups.csv' DELIMITER ',' CSV HEADER;
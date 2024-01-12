\c predictia_soccer_manager;

CREATE TABLE appearances (
    appearance_id VARCHAR(255),
    game_id INTEGER,
    player_id INTEGER,
    player_club_id INTEGER,
    player_current_club_id INTEGER,
    date VARCHAR(255),
    player_name VARCHAR(255),
    competition_id VARCHAR(255),
    yellow_cards INTEGER,
    red_cards INTEGER,
    goals INTEGER,
    assists INTEGER,
    minutes_played INTEGER
);
COPY appearances
FROM '/csv_files/appearances.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE club_games (
    game_id INTEGER,
    club_id INTEGER,
    own_goals INTEGER NULL,
    own_position INTEGER NULL,
    own_manager_name VARCHAR(255) NULL,
    opponent_id INTEGER NULL,
    opponent_goals INTEGER NULL,
    opponent_position INTEGER NULL,
    opponent_manager_name VARCHAR(255) NULL,
    hosting VARCHAR(255) NULL,
    is_win INTEGER NULL
);
COPY club_games
FROM '/csv_files/club_games.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE clubs_link_api (
    id INTEGER,
    name VARCHAR(255),
    short_name VARCHAR(255),
    tla VARCHAR(255),
    league_code VARCHAR(255),
    league_name VARCHAR(255),
    logo VARCHAR(255),
    id_soccer_manager INTEGER
);

COPY clubs_link_api
FROM '/csv_files/clubs_link_api.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE clubs (
    club_id INTEGER,
    club_code VARCHAR(255) NULL,
    name VARCHAR(255) NULL,
    domestic_competition_id VARCHAR(255) NULL,
    total_market_value VARCHAR(255) NULL,
    squad_size INTEGER NULL,
    average_age VARCHAR(255) NULL,
    foreigners_number INTEGER NULL,
    foreigners_percentage VARCHAR(255) NULL,
    national_team_players INTEGER NULL,
    stadium_name VARCHAR(255) NULL,
    stadium_seats INTEGER NULL,
    net_transfer_record VARCHAR(255) NULL,
    coach_name VARCHAR(255) NULL,
    last_season INTEGER NULL,
    filename VARCHAR(255) NULL,
    url VARCHAR(255) NULL
);
COPY clubs
FROM '/csv_files/clubs.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE competitions (
    competition_id VARCHAR(255) NULL,
    competition_code VARCHAR(255) NULL,
    name VARCHAR(255) NULL,
    sub_type VARCHAR(255) NULL,
    type VARCHAR(255) NULL,
    country_id VARCHAR(255) NULL,
    country_name VARCHAR(255) NULL,
    domestic_league_code VARCHAR(255) NULL,
    confederation VARCHAR(255) NULL,
    url VARCHAR(255) NULL
);
COPY competitions
FROM '/csv_files/competitions.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE game_events (
    game_event_id VARCHAR(255) NULL,
    date VARCHAR(255) NULL,
    game_id VARCHAR(255) NULL,
    minute INTEGER NULL,
    type VARCHAR(255) NULL,
    club_id INTEGER NULL,
    player_id INTEGER NULL,
    description VARCHAR(255) NULL,
    player_in_id INTEGER NULL,
    player_assist_id INTEGER NULL
);
COPY game_events
FROM '/csv_files/game_events.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE games (
    game_id INTEGER NULL,
    competition_id VARCHAR(255) NULL,
    season INTEGER NULL,
    round VARCHAR(255) NULL,
    date VARCHAR(255) NULL,
    home_club_id INTEGER NULL,
    away_club_id INTEGER NULL,
    home_club_goals INTEGER NULL,
    away_club_goals INTEGER NULL,
    home_club_position INTEGER NULL,
    away_club_position INTEGER NULL,
    home_club_manager_name VARCHAR(255) NULL,
    away_club_manager_name VARCHAR(255) NULL,
    stadium VARCHAR(255) NULL,
    attendance INTEGER NULL,
    referee VARCHAR(255) NULL,
    url VARCHAR(255) NULL,
    home_club_formation VARCHAR(255) NULL,
    away_club_formation VARCHAR(255) NULL,
    home_club_name VARCHAR(255) NULL,
    away_club_name VARCHAR(255) NULL,
    aggregate VARCHAR(255) NULL,
    competition_type VARCHAR(255) NULL
);
COPY games
FROM '/csv_files/games.csv' DELIMITER ',' CSV HEADER;

CREATE SEQUENCE "next_games_seq"
    increment BY 50;

ALTER SEQUENCE "next_games_seq" OWNER TO ADMIN;

CREATE TABLE next_games (
    next_game_id INTEGER PRIMARY KEY NOT NULL,
    home_club_id INTEGER,
    home_club_short_name TEXT,
    away_club_id INTEGER,
    away_club_short_name TEXT,
    home_club_logo_url TEXT,
    away_club_logo_url TEXT,
    status TEXT,
    game_date DATE,
    modified_date_verification DATE,
    prediction_win_home FLOAT,
    prediction_win_away FLOAT,
    prediction_draw FLOAT
);

CREATE TABLE player_valuations (
    player_id INTEGER NULL,
    date VARCHAR(255) NULL,
    datetime VARCHAR(255) NULL,
    dateweek VARCHAR(255) NULL,
    market_value_in_eur INTEGER NULL,
    current_club_id INTEGER NULL,
    player_club_domestic_competition_id VARCHAR(255) NULL
);
COPY player_valuations
FROM '/csv_files/player_valuations.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE players (
    player_id INTEGER NULL,
    first_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NULL,
    name VARCHAR(255) NULL,
    last_season INTEGER NULL,
    current_club_id INTEGER NULL,
    player_code VARCHAR(255) NULL,
    country_of_birth VARCHAR(255) NULL,
    city_of_birth VARCHAR(255) NULL,
    country_of_citizenship VARCHAR(255) NULL,
    date_of_birth VARCHAR(255) NULL,
    sub_position VARCHAR(255) NULL,
    position VARCHAR(255) NULL,
    foot VARCHAR(255) NULL,
    height_in_cm INTEGER NULL,
    contract_expiration_date VARCHAR(255) NULL,
    agent_name VARCHAR(255) NULL,
    image_url VARCHAR(255) NULL,
    url VARCHAR(255) NULL,
    current_club_domestic_competition_id VARCHAR(255) NULL,
    current_club_name VARCHAR(255) NULL,
    market_value_in_eur INTEGER NULL,
    highest_market_value_in_eur INTEGER NULL
);
COPY players
FROM '/csv_files/players.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE game_lineups (
    game_lineups_id TEXT NULL,
    game_id INTEGER NULL,
    club_id INTEGER NULL,
    type TEXT NULL,
    number TEXT NULL,
    player_id INTEGER NULL,
    player_name TEXT NULL,
    team_captain TEXT NULL,
    position TEXT NULL
);
COPY game_lineups
FROM '/csv_files/game_lineups.csv' DELIMITER ',' CSV HEADER;
CREATE TABLE next_games (
    next_game_id INTEGER PRIMARY KEY NOT NULL,
    home_club_id INTEGER,
    home_club_short_name TEXT,
    away_club_id INTEGER,
    away_club_short_name TEXT,
    status TEXT,
    game_date DATE,
    modified_date_verification DATE,
    prediction_win_home FLOAT,
    prediction_win_away FLOAT,
    prediction_draw FLOAT
);
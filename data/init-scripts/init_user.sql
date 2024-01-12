CREATE DATABASE predictia_user;

\c predictia_user;

CREATE SEQUENCE "users_seq"
    increment BY 50;
ALTER SEQUENCE "users_seq" OWNER TO ADMIN;

CREATE SEQUENCE "followed_teams_link_seq"
    increment BY 50;
ALTER SEQUENCE "followed_teams_link_seq" OWNER TO ADMIN;

CREATE TABLE users (
    id INTEGER PRIMARY KEY NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    mail VARCHAR(255),
    credits FLOAT,
    favorite_club_id INTEGER
);

CREATE TABLE followed_teams_link (
    id INTEGER PRIMARY KEY NOT NULL,
    id_user INTEGER,
    id_team INTEGER
);


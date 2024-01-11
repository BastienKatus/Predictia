CREATE DATABASE predictia_user;

\c predictia_user;

CREATE TABLE users (
    id INTEGER,
    credits FLOAT,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    mail VARCHAR(255),
    password VARCHAR(255),
    username VARCHAR(255)
);
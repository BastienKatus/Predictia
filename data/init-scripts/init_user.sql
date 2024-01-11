CREATE DATABASE predictia_user;

\c predictia_user;

CREATE SEQUENCE "user_seq"
    increment BY 1;
ALTER SEQUENCE "user_seq" OWNER TO ADMIN;

CREATE TABLE users (
    id INTEGER,
    credits FLOAT,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    mail VARCHAR(255),
    password VARCHAR(255),
    username VARCHAR(255)
);
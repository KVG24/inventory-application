#! /usr/bin/env node

const { Pool } = require("pg");
require("dotenv").config();

const SQL = `
    CREATE TABLE IF NOT EXISTS developers (
        developer_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS genres (
        genre_id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS games (
        game_id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        release_year INT,
        developer_id INT REFERENCES developers(developer_id)
    );

    CREATE TABLE IF NOT EXISTS game_genres (
        game_id INT REFERENCES games(game_id) ON DELETE CASCADE,
        genre_id INT REFERENCES genres(genre_id) ON DELETE CASCADE,
        PRIMARY KEY (game_id, genre_id)
    );

    INSERT INTO developers (name) VALUES
        ('CD Projekt Red'),
        ('Digital Extremes'),
        ('Electronic Arts'),
        ('Valve');
    
    INSERT INTO genres (name) VALUES
    ('Action'),
    ('Adventure'),
    ('Role-Playing'),
    ('Shooter'),
    ('Platformer'),
    ('Simulation'),
    ('Sports'),
    ('Racing'),
    ('Puzzle'),
    ('Strategy'),
    ('Fighting'),
    ('Horror'),
    ('Stealth'),
    ('Survival'),
    ('Open World'),
    ('MMORPG'),
    ('Party'),
    ('Rhythm'),
    ('Visual Novel'),
    ('Sandbox'),
    ('Tower Defense');

    INSERT INTO games (title, release_year, developer_id) VALUES
        ('The Witcher 3: Wild Hunt', 2015, 1),
        ('Warframe', 2013, 2),
        ('Half-Life 2', 2004, 4),
        ('Cyberpunk 2077', 2020, 1),
        ('Portal 2', 2011, 4),
        ('Need for Speed: Unbound', 2022, 3);

    INSERT INTO game_genres (game_id, genre_id) VALUES
        (1, 1),
        (1, 4),
        (2, 5),
        (3, 3),
        (4, 1),
        (4, 3),
        (4, 4),
        (5, 3),
        (6, 2),
        (6, 4);
`;

async function main() {
    console.log("seeding...");

    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await pool.query(SQL);
    await pool.end();
    console.log("done");
}

main();

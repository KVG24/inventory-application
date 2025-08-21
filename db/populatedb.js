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

INSERT INTO developers (developer_id, name) VALUES
    (1, 'CD Projekt Red'),
    (2, 'Digital Extremes'),
    (3, 'Electronic Arts'),
    (4, 'Valve'),
    (5, 'Bethesda Softworks'),
    (6, 'Kojima Productions');

INSERT INTO genres (genre_id, name) VALUES
    (1, 'Action'), 
    (2, 'Adventure'),
    (3, 'Role-Playing'),
    (4, 'Shooter'),
    (5, 'Platformer'),
    (6, 'Simulation'),
    (7, 'Sports'),
    (8, 'Racing'),
    (9, 'Puzzle'),
    (10, 'Strategy'),
    (11, 'Fighting'),
    (12, 'Horror'),
    (13, 'Stealth'),
    (14, 'Survival'),
    (15, 'Open World'),
    (16, 'MMORPG'),
    (17, 'Party'),
    (18, 'Rhythm'),
    (19, 'Visual Novel'),
    (20, 'Sandbox'),
    (21, 'Tower Defense');

INSERT INTO games (game_id, title, release_year, developer_id) VALUES
    (1, 'The Witcher 3: Wild Hunt', 2015, 1),
    (2, 'Warframe', 2013, 2),
    (3, 'Half-Life 2', 2004, 4),
    (4, 'Cyberpunk 2077', 2020, 1),
    (5, 'Portal 2', 2011, 4),
    (6, 'Need for Speed: Unbound', 2022, 3),
    (7, 'Need for Speed: Most Wanted', 2005, 3),
    (8, 'TES V: Skyrim', 2011, 5),
    (9, 'TES IV: Oblivion', 2006, 5),
    (10, 'TES III: Morrowind', 2002, 5),
    (11, 'Death Stranding', 2019, 6),
    (12, 'Death Stranding 2: ON THE BEACH', 2025, 6),
    (13, 'Dark Sector', 2008, 2);

INSERT INTO game_genres (game_id, genre_id) VALUES
    (1, 2), (1, 3), (1, 15),
    (2, 16), (2, 4), (2, 3), (2, 1),
    (3, 4), (3, 2),
    (4, 1), (4, 3), (4, 4),
    (5, 2), (5, 4), (5, 5),
    (6, 8), (6, 15),
    (7, 8), (7, 15),
    (8, 2), (8, 3), (8, 15),
    (9, 2), (9, 3), (9, 15),
    (10, 2), (10, 3), (10, 15),
    (11, 1), (11, 2), (11, 4), (11, 15),
    (12, 1), (12, 2), (12, 4), (12, 15),
    (13, 1), (13, 2), (13, 4);
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

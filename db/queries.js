const pool = require("./pool");

async function getGames() {
    const { rows } = await pool.query("SELECT * FROM games");
    return rows;
}

async function getGenres() {
    const { rows } = await pool.query("SELECT * FROM genres");
    return rows;
}

async function getDevelopers() {
    const { rows } = await pool.query("SELECT * FROM developers");
    return rows;
}

async function getGame(gameId) {
    const { rows } = await pool.query(
        `
        SELECT 
            g.game_id,
            g.title,
            g.release_year,
            g.developer_id,
            array_agg(gg.genre_id) AS genre_ids
        FROM games g
        LEFT JOIN game_genres gg ON g.game_id = gg.game_id
        WHERE g.game_id = $1
        GROUP BY g.game_id
    `,
        [gameId]
    );

    return rows[0];
}

async function getCombinedInfo() {
    const { rows } = await pool.query(`
        SELECT
            g.game_id,
            g.title,
            g.release_year,
            d.name AS developer,
            STRING_AGG(ge.name, ', ' ORDER BY ge.name) AS genres
        FROM games g
        JOIN developers d ON g.developer_id = d.developer_id
        JOIN game_genres gg ON g.game_id = gg.game_id
        JOIN genres ge ON gg.genre_id = ge.genre_id
        GROUP BY g.game_id, g.title, g.release_year, d.name
        ORDER BY g.release_year DESC;
    `);
    return rows;
}

async function addGame(title, releaseYear, developerId) {
    await pool.query(
        "INSERT INTO games (title, release_year, developer_id) VALUES ($1, $2, $3)",
        [title, releaseYear, developerId]
    );
}

async function addDeveloper(name) {
    await pool.query("INSERT INTO developers (name) VALUES ($1)", [name]);
}

async function addGenre(name) {
    await pool.query("INSERT INTO genres (name) VALUES ($1)", [name]);
}

async function setGameGenres(gameId, genreId) {
    await pool.query(
        "INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)",
        [gameId, genreId]
    );
}

module.exports = {
    getGames,
    getGenres,
    getDevelopers,
    getGame,
    getCombinedInfo,
    addGame,
    addDeveloper,
    addGenre,
    setGameGenres,
};

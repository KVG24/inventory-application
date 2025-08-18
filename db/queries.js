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

async function addGame(title, release_year, developer_id) {
    const result = await pool.query(
        `INSERT INTO games (title, release_year, developer_id)
         VALUES ($1, $2, $3)
         RETURNING game_id`,
        [title, release_year, developer_id]
    );
    return result.rows[0].game_id;
}

async function addDeveloper(name) {
    await pool.query(`INSERT INTO developers (name) VALUES ($1)`, [name]);
}

async function addGenre(name) {
    await pool.query("INSERT INTO genres (name) VALUES ($1)", [name]);
}

async function updateGame(title, release_year, developer_id, gameId) {
    await pool.query(
        `UPDATE games
            SET title = $1,
                release_year = $2,
                developer_id = $3
            WHERE game_id = $4`,
        [title, release_year, developer_id, gameId]
    );
}

async function setGameGenres(gameId, genreId) {
    await pool.query(
        "INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)",
        [gameId, genreId]
    );
}

async function deleteGame(gameId) {
    await pool.query(`DELETE FROM game_genres WHERE game_id = $1`, [gameId]);
    await pool.query(`DELETE FROM games WHERE game_id = $1`, [gameId]);
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
    updateGame,
    setGameGenres,
    deleteGame,
};

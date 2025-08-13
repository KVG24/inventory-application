const pool = require("./pool");

async function getGames() {
    const { rows } = await pool.query("SELECT * FROM games");
    return rows;
}

async function getCombinedInfo() {
    const { rows } = await pool.query(`
        SELECT
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

module.exports = { getGames, getCombinedInfo };

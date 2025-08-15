const db = require("../db/queries");
const pool = require("../db/pool");

async function renderIndex(req, res) {
    res.render("index", { games: await db.getCombinedInfo() });
}

async function renderUpdateForm(req, res) {
    const game = await db.getGame(req.params.id);
    const developers = await db.getDevelopers();
    const genres = await db.getGenres();

    res.render("update", { game, developers, genres });
}

async function updateGame(req, res) {
    const gameId = req.params.id;
    const { title, release_year, developer_id, genre_id } = req.body;

    try {
        await pool.query(
            `UPDATE games
             SET title = $1,
                 release_year = $2,
                 developer_id = $3
             WHERE game_id = $4`,
            [title, release_year, developer_id, gameId]
        );

        await pool.query(`DELETE FROM game_genres WHERE game_id = $1`, [
            gameId,
        ]);

        if (genre_id) {
            // if only one checkbox was selected, genre_id will be a string
            const genres = Array.isArray(genre_id) ? genre_id : [genre_id];

            for (const gId of genres) {
                await db.setGameGenres(gameId, gId);
            }
        }

        res.redirect("/");
    } catch (err) {
        console.error("Error updating game:", err);
        res.status(500).send("Error updating game");
    }
}

module.exports = { renderIndex, renderUpdateForm, updateGame };

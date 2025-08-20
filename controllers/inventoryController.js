const db = require("../db/queries");
const pool = require("../db/pool");
require("dotenv").config();

async function loginAdmin(req, res) {
    if (req.body.admin_password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        req.session.error = false;
    } else {
        req.session.isAdmin = false;
        req.session.error = true;
    }
    res.redirect("/");
}

async function renderIndex(req, res) {
    const search = req.query.search || "";
    const genre = req.query.genre || "";
    const developer = req.query.developer || "";
    let games;

    if (search) {
        games = await db.searchGames(search);
    } else if (genre) {
        games = await db.getGamesByGenre(genre);
    } else if (developer) {
        games = await db.getGamesByDeveloper(developer);
    } else {
        games = await db.getCombinedInfo();
    }

    const error = req.session.error || false;
    req.session.error = false;

    res.render("index", {
        games,
        genres: await db.getGenres(),
        developers: await db.getDevelopers(),
        searching: Boolean(search),
        search,
        admin: req.session.isAdmin || false,
        error,
    });
}

async function renderAdd(req, res) {
    const developers = await db.getDevelopers();
    const genres = await db.getGenres();
    res.render("add", { developers, genres });
}

async function addGame(req, res) {
    const { title, release_year, developer_id, genre_id } = req.body;
    try {
        const gameId = await db.addGame(title, release_year, developer_id);

        if (genre_id) {
            // if only one checkbox was selected, genre_id will be a string
            const genres = Array.isArray(genre_id) ? genre_id : [genre_id];
            for (const gId of genres) {
                await db.setGameGenres(gameId, gId);
            }
        }

        res.redirect("/");
    } catch (err) {
        console.error("Error adding game:", err);
        res.status(500).send("Error adding game");
    }
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
        await db.updateGame(title, release_year, developer_id, gameId);

        await pool.query(`DELETE FROM game_genres WHERE game_id = $1`, [
            gameId,
        ]);

        if (genre_id) {
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

async function deleteGame(req, res) {
    const gameId = req.params.id;

    try {
        await db.deleteGame(gameId);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting game:", err);
        res.status(500).send("Error deleting game");
    }
}

async function addDeveloper(req, res) {
    try {
        await db.addDeveloper(req.body.add_dev);
        res.redirect("/add");
    } catch (err) {
        console.error("Error adding developer:", err);
        res.status(500).send("Error adding developer");
    }
}

async function addGenre(req, res) {
    try {
        await db.addGenre(req.body.add_genre);
        res.redirect("/add");
    } catch (err) {
        console.error("Error adding genre:", err);
        res.status(500).send("Error adding genre");
    }
}

module.exports = {
    loginAdmin,
    renderIndex,
    renderAdd,
    addGame,
    renderUpdateForm,
    updateGame,
    deleteGame,
    addDeveloper,
    addGenre,
};

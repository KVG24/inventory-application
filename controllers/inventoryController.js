const db = require("../db/queries");

async function renderIndex(req, res) {
    res.render("index", { games: await db.getCombinedInfo() });
}

module.exports = { renderIndex };

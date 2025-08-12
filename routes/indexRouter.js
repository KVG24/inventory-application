const { Router } = require("express");
const { render } = require("ejs");

const router = Router();

router.get("/", (req, res) => res.render("index"));

module.exports = router;

const { Router } = require("express");
const { render } = require("ejs");
const inventoryController = require("../controllers/inventoryController");

const router = Router();

router.get("/", inventoryController.renderIndex);

module.exports = router;

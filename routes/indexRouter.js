const { Router } = require("express");
const { render } = require("ejs");
const inventoryController = require("../controllers/inventoryController");

const router = Router();

router.get("/", inventoryController.renderIndex);
router.get("/add", inventoryController.renderAdd);
router.post("/add", inventoryController.addGame);
router.get("/:id/update", inventoryController.renderUpdateForm);
router.post("/:id/update", inventoryController.updateGame);

module.exports = router;

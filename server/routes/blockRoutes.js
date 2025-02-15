const express = require("express");
const blockController = require("../controllers/blockController");

const router = express.Router();

router.get("/blocks", blockController.getBlocks);
router.post("/blocks", blockController.createBlock);

module.exports = router;
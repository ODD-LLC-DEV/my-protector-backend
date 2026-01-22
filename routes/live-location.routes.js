const { Router } = require("express");
const {
	saveLivelocation,
} = require("../controllers/live-location.controllers");
const router = Router();

router.post("/", saveLivelocation);

module.exports = router;

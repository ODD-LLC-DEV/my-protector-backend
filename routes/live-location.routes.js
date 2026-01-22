const { Router } = require("express");
const {
	getLiveLocations,
	saveLivelocation,
} = require("../controllers/live-location.controllers");
const router = Router();

router.get("/", getLiveLocations);

router.post("/", saveLivelocation);

module.exports = router;

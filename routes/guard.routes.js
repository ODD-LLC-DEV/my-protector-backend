const { Router } = require("express");
const {
	getGuardsForBooking,
	getGuardVideo,
	getAllGuardsForAdmin,
	getGuardDetails,
	fillGuardData,
	changeGuardStatusOrPrice,
} = require("../controllers/guard.controllers");
const configMulter = require("../config/multer");
const uploadMiddleware = require("../middlewares/upload");
const { checkAuth } = require("../middlewares/auth");
const checkRole = require("../middlewares/check-role");

const router = Router();

const multer = configMulter("guards-videos", "videos");

router.get("/", checkAuth, checkRole("ADMIN"), getAllGuardsForAdmin);

router.get("/by-id/:id", getGuardDetails);

router.get("/for-booking", getGuardsForBooking);

router.get("/:user_id/video", getGuardVideo);

router.post("/", uploadMiddleware(multer.single("video")), fillGuardData);

router.patch("/", checkAuth, checkRole("ADMIN"), changeGuardStatusOrPrice);

module.exports = router;

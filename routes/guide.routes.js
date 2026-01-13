const { Router } = require("express");
const {
	getGuidesForBooking,
	fillGuideData,
	changeGuideStatus,
} = require("../controllers/guide.controllers");
const configMulter = require("../config/multer");
const uploadMiddleware = require("../middlewares/upload");
const { checkAuth } = require("../middlewares/auth");
const checkRole = require("../middlewares/check-role");

const router = Router();

const multer = configMulter("guide-images");

router.get("/for-booking", getGuidesForBooking);

router.post("/", uploadMiddleware(multer.single("image")), fillGuideData);

router.patch("/status", checkAuth, checkRole("ADMIN"), changeGuideStatus);

module.exports = router;

const { Router } = require("express");
const {
	getGuidesForBooking,
	getAllGuidesForAdmin,
	getGuideDetails,
	fillGuideData,
	changeGuideStatusOrPrice,
} = require("../controllers/guide.controllers");
const configMulter = require("../config/multer");
const uploadMiddleware = require("../middlewares/upload");
const { checkAuth } = require("../middlewares/auth");
const checkRole = require("../middlewares/check-role");

const router = Router();

const multer = configMulter("users-images");

router.get("/", getAllGuidesForAdmin);

router.get("/by-id/:id", getGuideDetails);

router.get("/for-booking", getGuidesForBooking);

router.post("/", uploadMiddleware(multer.single("image")), fillGuideData);

router.patch("/", checkAuth, checkRole("ADMIN"), changeGuideStatusOrPrice);

module.exports = router;

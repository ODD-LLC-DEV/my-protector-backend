const { Router } = require("express");
const configMulter = require("../config/multer");
const {
	getUserProfile,
	getGuardProfile,
	getDriverProfile,
	getTranslatorProfile,
	updateUserProfile,
	updateGuardProfile,
	updateDriverProfile,
	updateTranslatorProfile,
} = require("../controllers/user.controllers");
const uploadMiddleware = require("../middlewares/upload");

const router = Router();

const multer = configMulter("users-images");

router.get("/profile", getUserProfile);

router.get("/guard/profile", getGuardProfile);

router.get("/driver/profile", getDriverProfile);

router.get("/translator/profile", getTranslatorProfile);

router.put(
	"/profile",
	uploadMiddleware(multer.single("image")),
	updateUserProfile,
);

router.put(
	"/guard/profile",
	uploadMiddleware(multer.single("image")),
	updateGuardProfile,
);

router.put(
	"/driver/profile",
	uploadMiddleware(multer.single("image")),
	updateDriverProfile,
);

router.put(
	"/translator/profile",
	uploadMiddleware(multer.single("image")),
	updateTranslatorProfile,
);

module.exports = router;

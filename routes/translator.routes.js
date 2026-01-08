const { Router } = require("express");
const {
	fillTranslatorData,
	changeTranslatorStatus,
} = require("../controllers/translator.conrollers");
const configMulter = require("../config/multer");
const uploadMiddleware = require("../middlewares/upload");
const { checkAuth } = require("../middlewares/auth");
const checkRole = require("../middlewares/check-role");

const router = Router();

const multer = configMulter("translator-files", "pdf");

router.post(
	"/",
	uploadMiddleware(
		multer.fields([
			{ name: "cv", maxCount: 1 },
			{ name: "image", maxCount: 1 },
		]),
	),
	fillTranslatorData,
);

router.patch("/status", checkAuth, checkRole("ADMIN"), changeTranslatorStatus);

module.exports = router;

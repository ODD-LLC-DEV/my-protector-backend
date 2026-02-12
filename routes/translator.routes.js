const { Router } = require("express");
const {
	getTranslatorsForBooking,
	getAllTranslatorsForAdmin,
	getTranslatorDetails,
	getTranslatorCv,
	fillTranslatorData,
	changeTranslatorStatusOrPrice,
} = require("../controllers/translator.conrollers");
const configMulter = require("../config/multer");
const uploadMiddleware = require("../middlewares/upload");
const { checkAuth } = require("../middlewares/auth");
const checkRole = require("../middlewares/check-role");

const router = Router();

const multer = configMulter("translator-files", "pdf");

router.get("/", getAllTranslatorsForAdmin);

router.get("/by-id/:id", getTranslatorDetails);

router.get("/:id/cv", getTranslatorCv);

router.get("/for-booking", getTranslatorsForBooking);

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

router.patch("/", checkAuth, checkRole("ADMIN"), changeTranslatorStatusOrPrice);

module.exports = router;

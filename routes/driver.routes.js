const { Router } = require("express");
const {
	getCarsForBooking,
	getAllDriversForAdmin,
	getDriverDetails,
	fillDriverData,
	fillCarData,
	changeDriverStatusOrPrice,
} = require("../controllers/driver.controllers");
const configMulter = require("../config/multer");
const uploadMiddleware = require("../middlewares/upload");
const { checkAuth } = require("../middlewares/auth");
const checkRole = require("../middlewares/check-role");

const router = Router();

const multer = configMulter("drivers-images");

router.get("/", getAllDriversForAdmin);

router.get("/by-id/:id", getDriverDetails);

router.get("/cars", getCarsForBooking);

router.post("/", uploadMiddleware(multer.single("image")), fillDriverData);

router.post(
	"/cars",
	uploadMiddleware(
		multer.fields([
			{ name: "license_image", maxCount: 1 },
			{ name: "car_image", maxCount: 1 },
		]),
	),
	fillCarData,
);

router.patch("/", checkAuth, checkRole("ADMIN"), changeDriverStatusOrPrice);

module.exports = router;

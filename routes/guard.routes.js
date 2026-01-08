const { Router } = require("express");
const {
	fillGuardData,
	changeGuardStatus,
} = require("../controllers/guard.controllers");
const configMulter = require("../config/multer");
const uploadMiddleware = require("../middlewares/upload");
const { checkAuth } = require("../middlewares/auth");
const checkRole = require("../middlewares/check-role");

const router = Router();

const multer = configMulter("guards-videos", "videos");

router.post("/", uploadMiddleware(multer.single("video")), fillGuardData);

router.patch("/status", checkAuth, checkRole("ADMIN"), changeGuardStatus);

module.exports = router;

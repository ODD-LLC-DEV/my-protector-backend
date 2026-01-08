const { Router } = require("express");
const {
	signup,
	loginUser,
	sendResetPasswordOtp,
	verifyResetOtp,
	changePassword,
	loginAdmin,
} = require("../controllers/auth.controllers");

const router = Router();

router.post("/signup", signup);

router.post("/login", loginUser);

router.post("/login/admin", loginAdmin);

router.post("/reset-password", sendResetPasswordOtp);

router.post("/verify-reset-otp", verifyResetOtp);

router.post("/change-password", changePassword);

module.exports = router;

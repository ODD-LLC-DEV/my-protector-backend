const { Router } = require("express");
const {
	getAllCustomersForAdmin,
	sendAlertNotification,
} = require("../controllers/customer.controllers");
const { checkAuth } = require("../middlewares/auth");
const checkRole = require("../middlewares/check-role");

const router = Router();

router.get("/", getAllCustomersForAdmin);

router.post(
	"/alert-notification",
	checkAuth,
	checkRole("Customer"),
	sendAlertNotification,
);

module.exports = router;

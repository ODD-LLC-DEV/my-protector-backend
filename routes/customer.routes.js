const { Router } = require("express");
const {
	sendAlertNotification,
} = require("../controllers/customer.controllers");
const router = Router();

router.post("/alert-notification", sendAlertNotification);

module.exports = router;

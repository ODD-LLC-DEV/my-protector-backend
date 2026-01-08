const { Router } = require("express");
const {
	getBookingsForCustomer,
	getBookingsForProtector,
	makeBooking,
} = require("../controllers/booking.controllers");

const router = Router();

router.get("/customer", getBookingsForCustomer);

router.get('/protector', getBookingsForProtector)

router.post("/", makeBooking);

module.exports = router;

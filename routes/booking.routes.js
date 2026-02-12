const { Router } = require("express");
const {
	getBookingsForCustomer,
	getBookingsForProtector,
	getUserBookingsForAdmin,
	makeBooking,
} = require("../controllers/booking.controllers");

const router = Router();

router.get("/users/:id", getUserBookingsForAdmin);

router.get("/customer", getBookingsForCustomer);

router.get("/protector", getBookingsForProtector);

router.post("/", makeBooking);

module.exports = router;

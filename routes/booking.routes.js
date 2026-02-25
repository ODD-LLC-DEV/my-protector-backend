const { Router } = require("express");
const {
	getBookingsForCustomer,
	getBookingsForProtector,
	getUserBookingsForAdmin,
	getProtecteesOfBookingForAdmin,
	makeBooking,
} = require("../controllers/booking.controllers");

const router = Router();

router.get("/users/:user_id", getUserBookingsForAdmin);

router.get("/details/:id/proctectees", getProtecteesOfBookingForAdmin);

router.get("/customer", getBookingsForCustomer);

router.get("/protector", getBookingsForProtector);

router.get("/details/:id/proctectees", getProtecteesOfBookingForAdmin);

router.post("/", makeBooking);

module.exports = router;

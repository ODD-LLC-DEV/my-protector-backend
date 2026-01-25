const sequelize = require("../config/db");
const Booking = require("../models/Booking");

async function getCustomersIdsForEmittingLiveLocations(protector_id, role) {
	const protector = await sequelize.models[role].findByPk(protector_id, {
		attributes: [],
		include: {
			model: Booking,
			attributes: ["user_id"],
			where: {
				status: "Pending",
			},
		},
	});

	return protector.Bookings;
}

module.exports = getCustomersIdsForEmittingLiveLocations;

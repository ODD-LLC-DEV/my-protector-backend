const Booking = require("../models/Booking");
const { Op } = require("sequelize");
const calculatePickupEndDate = require("./calculate-pickup-end-date");
const sequelize = require("../config/db");

async function createSearchFilterForProtectors(
	pickup_date,
	protection_duration,
	model,
) {
	const searchFilter = {};

	if (pickup_date && protection_duration) {
		const pickupEndDate = calculatePickupEndDate(
			protection_duration,
			pickup_date,
		);

		const data = await sequelize.models[model].findAll({
			attributes: ["id"],
			include: [
				{
					model: Booking,
					required: true,
					attributes: [],
					through: { attributes: [] },
					where: {
						[Op.and]: [
							{ pickup_date: { [Op.lte]: pickupEndDate } },
							{ pickup_end_date: { [Op.gte]: pickup_date } },
						],
					},
				},
			],
		});

		const dataIds = data.map((guard) => guard.id);

		if (dataIds.length > 0) {
			if (model !== "Driver") {
				searchFilter.id = { [Op.notIn]: dataIds };
			} else {
				searchFilter.driver_id = { [Op.notIn]: dataIds };
			}
		}
	}

	return searchFilter;
}

module.exports = createSearchFilterForProtectors;

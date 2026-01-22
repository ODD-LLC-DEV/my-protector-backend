const redisClient = require("../config/redis-client");
const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Guard = require("../models/Guard");
const Guide = require("../models/Guide");
const Translator = require("../models/Translator");
const User = require("../models/User");
const { Op } = require("sequelize");
const getDataFromRedis = require("../utils/get-data-from-redis");

const getLiveLocations = async (req, res) => {
	const userId = req.userId;

	const today = new Date().toLocaleString("en-US", {
		timeZone: "Africa/Cairo",
	});

	const bookings = await Booking.findAll({
		where: {
			user_id: userId,
			pickup_date: {
				[Op.gte]: today,
			},
			pickup_end_date: {
				[Op.lte]: today,
			},
		},
		attributes: ["id"],
		include: [
			{
				model: Guard,
				attributes: ["id"],
				through: {
					attributes: [],
				},
			},
			{
				model: Translator,
				attributes: ["id"],
				through: {
					attributes: [],
				},
			},
			{
				model: Driver,
				attributes: ["id"],
				through: {
					attributes: [],
				},
			},
			{
				model: Guide,
				attributes: ["id"],
				through: {
					attributes: [],
				},
			},
		],
	});

	const guards = [];
	const guides = [];
	const trnaslators = [];
	const drivers = [];

	for (const booking of bookings) {
		if (booking.Guards) {
			for (const guard of booking.Guards) {
				guards.push(await getDataFromRedis("Guard", guard.id));
			}
		}

		if (booking.Guides) {
			for (const guide of booking.Guides) {
				guides.push(await getDataFromRedis("Guide", guide.id));
			}
		}

		if (booking.Translators) {
			for (const translator of booking.Translators) {
				trnaslators.push(await getDataFromRedis("Translator", translator.id));
			}
		}

		if (booking.Drivers) {
			for (const driver of booking.Drivers) {
				drivers.push(await getDataFromRedis("Driver", driver.id));
			}
		}
	}

	res.status(200).json({ data: { guards, guides, trnaslators, drivers } });
};

const saveLivelocation = async (req, res) => {
	const { userId, protectorId, userRole } = req;

	const { latitude, longitude } = req.body;

	if (!latitude || !longitude) {
		return res.status(400).json({
			message: "latitude and longitude are required",
		});
	}

	console.log(req.body);

	const user = await User.findByPk(userId, {
		attributes: ["id", "name"],
		raw: true,
	});

	const date = new Date().toLocaleString("en-US", {
		timeZone: "Africa/Cairo",
	});

	await redisClient.hset(`${userRole}:${protectorId}`, {
		longitude,
		latitude,
		date,
		name: user.name,
		user_id: userId,
	});

	console.log(await redisClient.hgetall(`${userRole}:${protectorId}`));

	res.status(201).json({ message: "Location Stored Successfully" });
};

module.exports = {
	getLiveLocations,
	saveLivelocation,
};

const redisClient = require("../config/redis-client");
const User = require("../models/User");
const { QueryTypes } = require("sequelize");
const getDataFromRedis = require("../utils/get-data-from-redis");
const emitter = require("../config/event-emitter");
const sequelize = require("../config/db");

const getLiveLocations = async (req, res) => {
	const userId = req.userId;

	const bookings = await sequelize.query(
		`SELECT protector_id, role FROM (
    SELECT DB.driver_id AS protector_id, 'Driver' AS role FROM Bookings AS B LEFT JOIN Driver_Bookings AS DB ON DB.booking_id = B.id 
WHERE B.user_id = ${userId}
UNION ALL
SELECT GB.guard_id AS protector_id, 'Guard' AS role FROM Bookings AS B LEFT JOIN Guard_Bookings AS GB ON GB.booking_id = B.id 
WHERE B.user_id =${userId}
UNION ALL
SELECT GU.guide_id AS protector_id, 'Guide' AS role FROM Bookings AS B LEFT JOIN Guide_Bookings AS GU ON GU.booking_id = B.id 
WHERE B.user_id = ${userId}
UNION ALL
SELECT TB.translator_id AS protector_id, 'Translator' AS role FROM Bookings AS B LEFT JOIN Translator_Bookings AS TB ON TB.booking_id = B.id 
WHERE B.user_id = ${userId} ) AS User_Bookings
WHERE protector_id IS NOT NULL;`,
		{ type: QueryTypes.SELECT },
	);

	const guards = [];
	const guides = [];
	const translators = [];
	const drivers = [];

	for (const booking of bookings) {
		if (booking.role === "Guard") {
			for (const guard of booking.Guards) {
				guards.push(await getDataFromRedis("Guard", guard.protector_id));
			}
		}

		if (booking.role === "Guide") {
			for (const guide of booking.Guides) {
				guides.push(await getDataFromRedis("Guide", guide.protector_id));
			}
		}

		if (booking.role === "Translator") {
			for (const translator of booking.Translators) {
				translators.push(
					await getDataFromRedis("Translator", translator.protector_id),
				);
			}
		}

		if (booking.role === "Driver") {
			for (const driver of booking.Drivers) {
				drivers.push(await getDataFromRedis("Driver", driver.protector_id));
			}
		}
	}

	res.status(200).json({ data: { guards, guides, translators, drivers } });
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

	const date = new Date().toLocaleString("en-US", {
		timeZone: "Africa/Cairo",
	});

	const user = await User.findByPk(userId, {
		attributes: ["id", "name"],
		raw: true,
	});

	emitter.emit("send-live-data", {
		user_id: userId,
		latitude,
		longitude,
		role: req.userRole,
		date,
		name: user.name,
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

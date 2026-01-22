const redisClient = require("../config/redis-client");

const saveLivelocation = async (req, res) => {
	const userId = req.userId;

	const { latitude, longitude } = req.body;

	if (!latitude || !longitude) {
		return res.status(400).json({
			message: "latitude and longitude are required",
		});
	}

	console.log(req.body);

	// const date = new Date();

	// date.toLocaleDateString("ar-EG", {});

	// await redisClient.hset(`user:${userId}`, {
	// 	longitude,
	// 	latitude,
	// });

	res.status(201).json({ message: "Location Stored Successfully" });
};

module.exports = {
	saveLivelocation,
};

const sequelize = require("../config/db");
const redisClient = require("../config/redis-client");
const User = require("../models/User");

async function getDataFromRedis(role, id) {
	const data = await redisClient.hgetall(`${role}:${id}`);

	console.log(data);

	if (Object.keys.length === 0) {
		const user = await sequelize.models[role].findByPk(id, {
			attributes: [],
			include: {
				model: User,
				attributes: ["id", "name"],
			},
		});

		return {
			user_id: user.User.id,
			name: user.User.name,
			date: null,
			longitude: null,
			latitude: null,
		};
	}

	return data;
}

module.exports = getDataFromRedis;

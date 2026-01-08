const User = require("../models/User");
const Guard = require("../models/Guard");
const sequelize = require("../config/db");
const CustomError = require("../config/custom-error");
const { existsSync, unlinkSync } = require("node:fs");
const { Op } = require("sequelize");
const Driver = require("../models/Driver");
const Translator = require("../models/Translator");

const getUserProfile = async (req, res) => {
	const userId = req.userId;

	const user = await User.findByPk(userId, {
		attributes: ["id", "name", "phone_number", "image_link"],
	});

	res.status(200).json({ data: user });
};

const getGuardProfile = async (req, res) => {
	const userId = req.userId;

	const user = await User.findByPk(userId, {
		attributes: ["id", "name", "phone_number", "image_link"],
		include: {
			model: Guard,
			attributes: ["age", "weight", "height", "skills"],
		},
	});

	res.status(200).json({ data: user });
};

const getDriverProfile = async (req, res) => {
	const userId = req.userId;

	const user = await User.findByPk(userId, {
		attributes: ["id", "name", "phone_number", "image_link"],
		include: {
			model: Driver,
			attributes: ["age", "weight", "height"],
		},
	});

	res.status(200).json({ data: user });
};

const getTranslatorProfile = async (req, res) => {
	const userId = req.userId;

	const user = await User.findByPk(userId, {
		attributes: ["id", "name", "phone_number", "image_link"],
		include: {
			model: Translator,
			attributes: ["languages", "age"],
		},
	});

	res.status(200).json({ data: user });
};

const updateUserProfile = async (req, res) => {
	const userId = req.userId;

	const { id, ...updatedData } = req.body;

	const user = await User.findByPk(userId, {
		attributes: ["id", "image_link"],
		raw: true,
	});

	if (updatedData.phone_number) {
		const user = await User.findOne({
			where: {
				phone_number: updatedData.phone_number,
				id: {
					[Op.ne]: userId,
				},
			},
			attributes: ["id"],
			raw: true,
		});

		if (user) {
			throw new CustomError("Phone Number Already User", 409);
		}
	}

	const response = { message: "User profile updated successfully" };

	if (req.file) {
		if (existsSync(user.image_link)) {
			unlinkSync(user.image_link);
		}

		updatedData.image_link = req.file.path;

		response.new_image_link = `${process.env.BASE_URL}/api/${updatedData.image_link}`;
	}

	await User.update(updatedData, {
		where: {
			id: userId,
		},
	});

	res.status(200).json(response);
};

const updateGuardProfile = async (req, res) => {
	const userId = req.userId;

	const protectorId = req.protectorId;

	const { id, name, phone_number, ...guardData } = req.body;

	const user = await User.findByPk(userId, {
		attributes: ["id", "image_link"],
		raw: true,
	});

	const userData = {};

	if (phone_number) {
		const user = await User.findOne({
			where: {
				phone_number,
				id: {
					[Op.ne]: userId,
				},
			},
			attributes: ["id"],
			raw: true,
		});

		if (user) {
			throw new CustomError("Phone Number Already User", 409);
		}

		userData.phone_number = phone_number;
	}

	if (name) {
		userData.name = name;
	}

	const response = { message: "User profile updated successfully" };

	if (req.file) {
		if (existsSync(user.image_link)) {
			unlinkSync(user.image_link);
		}

		userData.image_link = req.file.path;

		response.new_image_link = `${process.env.BASE_URL}/api/${userData.image_link}`;
	}

	await sequelize.transaction(async (transaction) => {
		await User.update(userData, {
			where: {
				id: userId,
			},
			transaction,
		});

		await Guard.update(guardData, {
			where: {
				id: protectorId,
			},
			transaction,
		});
	});

	res.status(200).json(response);
};

const updateDriverProfile = async (req, res) => {
	const userId = req.userId;

	const protectorId = req.protectorId;

	const { id, name, phone_number, ...driverData } = req.body;

	const user = await User.findByPk(userId, {
		attributes: ["id", "image_link"],
		raw: true,
	});

	const userData = {};

	if (phone_number) {
		const user = await User.findOne({
			where: {
				phone_number,
				id: {
					[Op.ne]: userId,
				},
			},
			attributes: ["id"],
			raw: true,
		});

		if (user) {
			throw new CustomError("Phone Number Already User", 409);
		}

		userData.phone_number = phone_number;
	}

	if (name) {
		userData.name = name;
	}

	const response = { message: "User profile updated successfully" };

	if (req.file) {
		if (existsSync(user.image_link)) {
			unlinkSync(user.image_link);
		}

		userData.image_link = req.file.path;

		response.new_image_link = `${process.env.BASE_URL}/api/${userData.image_link}`;
	}

	await sequelize.transaction(async (transaction) => {
		await User.update(userData, {
			where: {
				id: userId,
			},
			transaction,
		});

		await Driver.update(driverData, {
			where: {
				id: protectorId,
			},
			transaction,
		});
	});

	res.status(200).json(response);
};

const updateTranslatorProfile = async (req, res) => {
	const userId = req.userId;

	const protectorId = req.protectorId;

	const { id, name, phone_number, ...translatorData } = req.body;

	const user = await User.findByPk(userId, {
		attributes: ["id", "image_link"],
		raw: true,
	});

	const userData = {};

	if (phone_number) {
		const user = await User.findOne({
			where: {
				phone_number,
				id: {
					[Op.ne]: userId,
				},
			},
			attributes: ["id"],
			raw: true,
		});

		if (user) {
			throw new CustomError("Phone Number Already User", 409);
		}

		userData.phone_number = phone_number;
	}

	if (name) {
		userData.name = name;
	}

	const response = { message: "User profile updated successfully" };

	if (req.file) {
		if (existsSync(user.image_link)) {
			unlinkSync(user.image_link);
		}

		userData.image_link = req.file.path;

		response.new_image_link = `${process.env.BASE_URL}/api/${userData.image_link}`;
	}

	await sequelize.transaction(async (transaction) => {
		await User.update(userData, {
			where: {
				id: userId,
			},
			transaction,
		});

		await Translator.update(translatorData, {
			where: {
				id: protectorId,
			},
			transaction,
		});
	});

	res.status(200).json(response);
};

module.exports = {
	getUserProfile,
	getGuardProfile,
	getDriverProfile,
	getTranslatorProfile,
	updateUserProfile,
	updateGuardProfile,
	updateDriverProfile,
	updateTranslatorProfile,
};

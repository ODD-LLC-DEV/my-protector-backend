const sequelize = require("../config/db");
const Guide = require("../models/Guide");
const User = require("../models/User");
const createSearchFilterForProtectors = require("../utils/create-search-filter");

const getGuidesForBooking = async (req, res) => {
	const { pickup_date, protection_duration } = req.query;

	const guideSearchFilter = await createSearchFilterForProtectors(
		pickup_date,
		protection_duration,
		"Guide",
	);

	guideSearchFilter.status = "ACCEPTED";

	const guides = await User.findAll({
		attributes: ["name"],
		where: {
			role: "Guide",
		},
		include: {
			model: Guide,
			where: guideSearchFilter,
			attributes: ["id", "gender", "age", "image_link", "price"],
		},
	});

	res.status(200).json({
		data: guides,
	});
};

const getAllGuidesForAdmin = async (_req, res) => {
	const guides = await User.findAll({
		attributes: {
			exclude: ["role", "password"],
		},
		include: {
			model: Guide,
			attributes: [],
			required: true,
		},
	});

	res.status(200).json({ data: guides });
};

const getGuideDetails = async (req, res) => {
	const { id } = req.params;

	const guide = await Guide.findOne({
		where: {
			user_id: id,
		},
		attributes: {
			exclude: ["user_id"],
		},
	});

	res.status(200).json({ data: guide });
};

const fillGuideData = async (req, res) => {
	const { gender, age, user_id } = req.body || {};

	if (!gender || !age || !user_id || !req.file) {
		throw new CustomError("Please fill all fields", 400);
	}

	await sequelize.transaction(async (transaction) => {
		await Guide.create(
			{
				gender,
				age,
				user_id,
			},
			{
				transaction,
			},
		);

		await User.update(
			{
				image_link: req.file.path,
			},
			{
				where: {
					id: user_id,
				},
				transaction,
			},
		);
	});

	res.status(201).json({ message: "Guide created successfully" });
};

const changeGuideStatusOrPrice = async (req, res) => {
	const { guide_id, status, price } = req.body;

	if (!guide_id) {
		return res.status(400).json({ message: "guide_id is required" });
	}

	const guide = await Guide.findByPk(guide_id, {
		attributes: ["id"],
		raw: true,
	});

	if (!guide) {
		return res.status(404).json({ message: "Guide not found" });
	}

	const updatedData = {};

	if (status) {
		updatedData.status = status;
	}

	if (price) {
		updatedData.price = price;
	}

	await Guide.update(updatedData, {
		where: {
			id: guide_id,
		},
	});

	res.status(200).json({
		message: "Guide data updated successfully",
	});
};

module.exports = {
	getGuidesForBooking,
	getAllGuidesForAdmin,
	getGuideDetails,
	fillGuideData,
	changeGuideStatusOrPrice,
};

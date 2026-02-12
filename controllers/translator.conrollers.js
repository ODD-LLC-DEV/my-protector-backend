const CustomError = require("../config/custom-error");
const sequelize = require("../config/db");
const Translator = require("../models/Translator");
const User = require("../models/User");
const createSearchFilterForProtectors = require("../utils/create-search-filter");

const getTranslatorsForBooking = async (req, res) => {
	const { pickup_date, protection_duration } = req.query;

	const translatorSearchFilter = await createSearchFilterForProtectors(
		pickup_date,
		protection_duration,
		"Translator",
	);

	translatorSearchFilter.status = "ACCEPTED";

	const translators = await User.findAll({
		attributes: ["name"],
		include: {
			model: Translator,
			where: translatorSearchFilter,
			attributes: {
				exclude: ["user_id", "status"],
			},
		},
	});

	res.status(200).json({ data: translators });
};

const getAllTranslatorsForAdmin = async (_req, res) => {
	const translators = await User.findAll({
		include: {
			model: Translator,
			attributes: [],
			required: true,
		},
		attributes: {
			exclude: ["password", "role"],
		},
	});

	res.status(200).json({ data: translators });
};

const getTranslatorDetails = async (req, res) => {
	const { id } = req.params;

	const translator = await Translator.findOne({
		where: {
			user_id: id,
		},
		attributes: {
			exclude: ["cv_link", "user_id"],
		},
	});

	res.status(200).json({ data: translator });
};

const getTranslatorCv = async (req, res) => {
	const { id } = req.params;

	const translator = await Translator.findByPk(id, {
		attributes: ["cv_link"],
		raw: true,
	});

	if (!translator) {
		return res.status(404).json({ message: "Translator Not Found" });
	}

	res.download(translator.cv_link, "cv");
};

const fillTranslatorData = async (req, res) => {
	const { gender, age, languages, user_id } = req.body || {};

	if (
		!gender ||
		!age ||
		!languages ||
		!user_id ||
		!req.files.cv ||
		!req.files.image
	) {
		throw new CustomError("Please fill all fields", 400);
	}

	await sequelize.transaction(async (transaction) => {
		await Translator.create(
			{
				gender,
				age,
				languages: languages,
				cv_link: req.files.cv[0].path,
				user_id,
			},
			{
				transaction,
			},
		);

		await User.update(
			{
				image_link: req.files.image[0].path,
			},
			{
				where: {
					id: user_id,
				},
				transaction,
			},
		);
	});

	res.status(201).json({ message: "Translator created successfully" });
};

const changeTranslatorStatusOrPrice = async (req, res) => {
	const { translator_id, status, price } = req.body;

	if (!translator_id) {
		return res.status(400).json({ message: "translator_id is required" });
	}

	const translator = await Translator.findByPk(translator_id, {
		attributes: ["id"],
		raw: true,
	});

	if (!translator) {
		return res.status(404).json({ message: "Translator not found" });
	}

	const updatedData = {};

	if (price) {
		updatedData.price = price;
	}

	if (status) {
		updatedData.status = status;
	}

	await Translator.update(updatedData, {
		where: {
			id: translator_id,
		},
	});
	res.status(200).json({
		message: "Translator data updated successfully",
	});
};

module.exports = {
	getTranslatorsForBooking,
	getAllTranslatorsForAdmin,
	getTranslatorDetails,
	getTranslatorCv,
	fillTranslatorData,
	changeTranslatorStatusOrPrice,
};

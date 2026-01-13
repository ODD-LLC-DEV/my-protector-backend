const CustomError = require("../config/custom-error");
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

	await Translator.create({
		gender,
		age,
		languages: languages,
		cv_link: req.files.cv[0].path,
		image_link: req.files.image[0].path,
		user_id,
	});

	res.status(201).json({ message: "Translator created successfully" });
};

const changeTranslatorStatus = async (req, res) => {
	const { translator_id, status } = req.body;

	if (!translator_id || !status) {
		return res.status(400).json({ message: "Please fill all fields" });
	}

	const translator = await Translator.findByPk(translator_id, {});

	if (!translator) {
		return res.status(404).json({ message: "Translator not found" });
	}

	await Translator.update(
		{
			status,
		},
		{
			where: {
				id: translator_id,
			},
		},
	);
	res.status(200).json({
		message: "Translator status updated successfully",
	});
};

module.exports = {
	getTranslatorsForBooking,
	fillTranslatorData,
	changeTranslatorStatus,
};

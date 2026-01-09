const sequelize = require("../config/db");
const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Guard = require("../models/Guard");
const Translator = require("../models/Translator");
const User = require("../models/User");
const { Op } = require("sequelize");

const getBookingsForCustomer = async (req, res) => {
	const userId = req.userId;

	const bookings = await Booking.findAll({
		where: {
			user_id: userId,
			[Op.or]: [
				{ "$Guards.id$": { [Op.ne]: null } },
				{ "$Drivers.id$": { [Op.ne]: null } },
				{ "$Translators.id$": { [Op.ne]: null } },
			],
		},
		subQuery: false,
		order: [["id", "DESC"]],
		attributes: [], // better keep at least booking id
		include: [
			{
				model: Guard,
				required: false,
				attributes: ["id"],
				through: { attributes: [] },
				include: {
					model: User,
					attributes: ["id", "name", "image_link"],
				},
			},
			{
				model: Driver,
				required: false,
				attributes: ["id"],
				through: { attributes: [] },
				include: {
					model: User,
					attributes: ["id", "name", "image_link"],
				},
			},
			{
				model: Translator,
				required: false,
				attributes: ["id"],
				through: { attributes: [] },
				include: {
					model: User,
					attributes: ["id", "name", "image_link"],
				},
			},
		],
	});

	res.status(200).json({ data: bookings });
};

const getBookingsForProtector = async (req, res) => {
	const { userRole, protectorId } = req;

	const { date } = req.query;

	const searchFilter = {};

	if (date) {
		searchFilter.pickup_date = date;
	}

	const guard = await sequelize.models[userRole].findByPk(protectorId, {
		attributes: [],
		include: {
			model: Booking,
			required: false,
			where: searchFilter,
			attributes: [
				"pickup_longitude",
				"pickup_latitude",
				"pickup_city",
				"pickup_date",
				"pickup_time",
				"no_of_protectees",
			],
			through: {
				attributes: [],
			},
			include: {
				model: User,
				attributes: ["id", "name", "image_link"],
			},
		},
	});

	res.status(200).json({ data: guard ? guard.Bookings : [] });
};

const makeBooking = async (req, res) => {
	const {
		pickup_country,
		pickup_city,
		pickup_street,
		pickup_building_number,
		pickup_longitude,
		pickup_latitude,
		pickup_date,
		pickup_time,
		protection_duration,
		dress_code,
		no_of_guards,
		no_of_cars,
		no_of_protectees,
		guard_gender,
		add_translator,
		translator_lang,
		add_guide,
		total_price,
	} = req.body;

	if (
		!pickup_country ||
		!pickup_city ||
		!pickup_street ||
		!pickup_building_number ||
		!pickup_longitude ||
		!pickup_latitude ||
		!pickup_date ||
		!pickup_time ||
		!protection_duration ||
		!dress_code ||
		!no_of_guards ||
		!no_of_cars ||
		!no_of_protectees ||
		!guard_gender ||
		!total_price
	) {
		return res.status(400).json({
			message: "All fields are required",
		});
	}

	const userId = req.userId;

	await Booking.create({
		pickup_country,
		pickup_city,
		pickup_street,
		pickup_building_number,
		pickup_longitude,
		pickup_latitude,
		pickup_date,
		pickup_time,
		protection_duration,
		dress_code,
		no_of_guards,
		no_of_cars,
		no_of_protectees,
		guard_gender,
		add_translator,
		translator_lang,
		add_guide,
		total_price,
		user_id: userId,
	});

	res.status(201).json({
		message: "Booking created successfully",
	});
};

module.exports = {
	getBookingsForCustomer,
	getBookingsForProtector,
	makeBooking,
};

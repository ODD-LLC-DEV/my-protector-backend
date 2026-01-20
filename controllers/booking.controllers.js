const sequelize = require("../config/db");
const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Guard = require("../models/Guard");
const Translator = require("../models/Translator");
const User = require("../models/User");
const { Op } = require("sequelize");
const bulkCreateWithBooking = require("../utils/bulk-create-with-booking");
const GuardBooking = require("../models/Guard-Booking");
const DriverBooking = require("../models/Driver-Booking");
const GuideBooking = require("../models/Guide-Booking");
const TranslatorBooking = require("../models/Translator-Booking");
const Guide = require("../models/Guide");

const getBookingsForCustomer = async (req, res) => {
	const userId = req.userId;

	const bookings = await Booking.findAll({
		where: {
			user_id: userId,
			[Op.or]: [
				{ "$Guards.id$": { [Op.ne]: null } },
				{ "$Drivers.id$": { [Op.ne]: null } },
				{ "$Translators.id$": { [Op.ne]: null } },
				{ "$Guides.id$": { [Op.ne]: null } },
			],
		},
		subQuery: false,
		order: [["id", "DESC"]],
		attributes: [],
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
			{
				model: Guide,
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
		end_date,
		dress_code,
		no_of_guards,
		no_of_cars,
		no_of_protectees,
		guard_gender,
		add_translator,
		add_guide,
		translator_lang,
		total_price,
		guard_ids,
		car_ids,
		translator_ids,
		guide_ids,
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
		!end_date ||
		!dress_code ||
		!guard_gender ||
		!total_price
	) {
		return res.status(400).json({
			message: "All fields are required",
		});
	}

	const userId = req.userId;

	await sequelize.transaction(async (transaction) => {
		const booking = await Booking.create(
			{
				pickup_country,
				pickup_city,
				pickup_street,
				pickup_building_number,
				pickup_longitude,
				pickup_latitude,
				pickup_date,
				pickup_time,
				pickup_end_date: end_date,
				dress_code,
				no_of_guards,
				no_of_cars,
				no_of_protectees,
				guard_gender,
				add_translator,
				add_guide,
				translator_lang,
				total_price,
				user_id: userId,
			},
			{ transaction },
		);

		await bulkCreateWithBooking(
			GuardBooking,
			booking.id,
			guard_ids,
			"guard_id",
			transaction,
		);
		await bulkCreateWithBooking(
			DriverBooking,
			booking.id,
			car_ids,
			"driver_id",
			transaction,
		);
		await bulkCreateWithBooking(
			GuideBooking,
			booking.id,
			guide_ids,
			"guide_id",
			transaction,
		);
		await bulkCreateWithBooking(
			TranslatorBooking,
			booking.id,
			translator_ids,
			"translator_id",
			transaction,
		);
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

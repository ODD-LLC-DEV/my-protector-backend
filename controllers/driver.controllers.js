const CarData = require("../models/Car-Data");
const Driver = require("../models/Driver");
const CustomError = require("../config/custom-error");
const createSearchFilterForProtectors = require("../utils/create-search-filter.js");

const getCarsForBooking = async (req, res) => {
	const { pickup_date, protection_duration } = req.query;

	const carSearchFilter = await createSearchFilterForProtectors(
		pickup_date,
		protection_duration,
		"Driver",
	);

	const users = await Driver.findAll({
		where: {
			status: "ACCEPTED",
		},
		attributes: [],
		include: {
			model: CarData,
			where: carSearchFilter,
			attributes: [
				"brand",
				"model",
				"model_year",
				"car_image_link",
				"driver_id",
				"price",
			],
		},
	});

	res.status(200).json({ data: users });
};

const fillDriverData = async (req, res) => {
	const { gender, age, weight, height, user_id } = req.body || {};

	if (!gender || !age || !weight || !height || !user_id || !req.file) {
		throw new CustomError("All fields are required", 400);
	}

	const driver = await Driver.create({
		gender,
		age,
		weight,
		height,
		image_link: req.file.path,
		user_id,
	});

	res.status(201).json({
		message: "Driver Created Successfully",
		driver_id: driver.id,
	});
};

const fillCarData = async (req, res) => {
	const { brand, model, model_year, driver_id } = req.body || {};

	if (
		!brand ||
		!model ||
		!model_year ||
		!driver_id ||
		!req.files.license_image ||
		!req.files.car_image
	) {
		throw new CustomError("All fields are required", 400);
	}

	await CarData.create({
		brand,
		model,
		model_year,
		license_image_link: req.files.license_image[0].path,
		car_image_link: req.files.car_image[0].path,
		driver_id: driver_id,
	});

	res.status(201).json({ message: "Car Data Filled Successfully" });
};

const changeDriverStatus = async (req, res) => {
	const { driver_id, status } = req.body;

	if (!driver_id || !status) {
		return res.status(400).json({ message: "Please fill all fields" });
	}

	const driver = await Driver.findByPk(driver_id, {
		attributes: ["id"],
		raw: true,
	});

	if (!driver) {
		return res.status(404).json({ message: "Driver not found" });
	}

	await Driver.update(
		{
			status,
		},
		{
			where: {
				id: driver_id,
			},
		},
	);
	res.status(200).json({
		message: "Driver status updated successfully",
	});
};

module.exports = {
	getCarsForBooking,
	fillDriverData,
	fillCarData,
	changeDriverStatus,
};

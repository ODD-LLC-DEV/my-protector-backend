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

const fillGuideData = async (req, res) => {
	const { gender, age, user_id } = req.body || {};

	if (!gender || !age || !user_id || !req.file) {
		throw new CustomError("Please fill all fields", 400);
	}

	await Guide.create({
		gender,
		age,
		image_link: req.file.path,
		user_id,
	});

	res.status(201).json({ message: "Guide created successfully" });
};

const changeGuideStatus = async (req, res) => {
	const { guide_id, status } = req.body;

	if (!guide_id || !status) {
		return res.status(400).json({ message: "Please fill all fields" });
	}

	const guide = await Guide.findByPk(guide_id, {
		attributes: ["id"],
		raw: true,
	});

	if (!guide) {
		return res.status(404).json({ message: "Guide not found" });
	}

	await Guide.update(
		{
			status,
		},
		{
			where: {
				id: guide_id,
			},
		},
	);
	res.status(200).json({
		message: "Guide status updated successfully",
	});
};

module.exports = {
	getGuidesForBooking,
	fillGuideData,
	changeGuideStatus,
};

const Guard = require("../models/Guard");

const fillGuardData = async (req, res) => {
	const { gender, age, weight, height, skills, user_id } = req.body;

	if (
		!gender ||
		!age ||
		!weight ||
		!height ||
		!skills ||
		!user_id ||
		!req.file
	) {
		return res.status(400).json({ message: "Please fill all fields" });
	}

	await Guard.create({
		gender,
		age,
		weight,
		height,
		skills,
		video_link: req.file.path,
		user_id,
	});
	res.status(201).json({
		message: "Guard created successfully",
	});
};

const changeGuardStatus = async (req, res) => {
	const { guard_id, status } = req.body;

	if (!guard_id || !status) {
		return res.status(400).json({ message: "Please fill all fields" });
	}

	const guard = await Guard.findByPk(guard_id, {
		attributes: ["id"],
		raw: true,
	});

	if (!guard) {
		return res.status(404).json({ message: "Guard not found" });
	}

	await Guard.update(
		{
			status,
		},
		{
			where: {
				id: guard_id,
			},
		},
	);
	res.status(200).json({
		message: "Guard status updated successfully",
	});
};

module.exports = {
	fillGuardData,
	changeGuardStatus,
};

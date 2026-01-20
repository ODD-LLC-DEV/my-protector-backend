const Guard = require("../models/Guard");
const fs = require("node:fs");
const User = require("../models/User");
const createSearchFilterForProtectors = require("../utils/create-search-filter.js");
const CustomeError = require("../config/custom-error.js");

const getGuardsForBooking = async (req, res) => {
	const { gender, pickup_date, protection_duration } = req.query;

	const guardSearchFilter = await createSearchFilterForProtectors(
		pickup_date,
		protection_duration,
		"Guard",
	);

	if (gender) {
		guardSearchFilter.gender = gender;
	}

	guardSearchFilter.status = "ACCEPTED";

	const users = await User.findAll({
		where: {
			role: "Guard",
		},
		attributes: ["name", "image_link"],
		include: {
			model: Guard,
			where: guardSearchFilter,
			attributes: [
				"id",
				"age",
				"gender",
				"weight",
				"height",
				"skills",
				"price",
			],
		},
	});

	res.status(200).json({ data: users });
};

const getGuardVideo = async (req, res) => {
	const { user_id } = req.params;

	const { Range } = req.headers;

	const guard = await Guard.findByPk(user_id, {
		attributes: ["video_link"],
	});

	if (!guard) {
		throw new CustomeError("Guard Not Found", 404);
	}

	// const videoPath = path.join(__dirname, guard.video_link);

	const { size } = await fs.promises.stat(guard.video_link);

	if (Range) {
		console.log("ssssssssssssssss");
		// Parse the range header
		const parts = Range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		const chunksize = end - start + 1;
		const file = fs.createReadStream(guard.video_link, { start, end });

		// Set headers for partial content
		const head = {
			"Content-Range": `bytes ${start}-${end}/${fileSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": chunksize,
			"Content-Type": "video/mp4",
		};

		res.writeHead(206, head); // 206 Partial Content
		file.pipe(res);
	} else {
		res.writeHead(200, {
			// "Content-Length": size,
			"Accept-Ranges": "bytes",
			"Cache-Control": "public, max-age=3600",
		});

		fs.createReadStream(guard.video_link).pipe(res);
	}
};

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
	getGuardsForBooking,
	getGuardVideo,
	fillGuardData,
	changeGuardStatus,
};

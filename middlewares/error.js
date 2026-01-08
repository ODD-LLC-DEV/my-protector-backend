const fs = require("node:fs");
const {
	UniqueConstraintError,
	ValidationError,
	ForeignKeyConstraintError,
} = require("sequelize");

const errorHandler = (err, req, res, _next) => {
	console.error(`Error for request ${req.method} ${req.path}`, err);

	if (req.file) {
		fs.unlinkSync(req.file.path);
	}

	// many files to remove
	else if (req.files) {
		if (Array.isArray(req.files)) {
			for (const image of req.files) {
				fs.unlinkSync(image.path);
			}
		}

		if (req.files.license_image) {
			const imagePath = req.files.license_image[0].path;

			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		if (req.files.car_image) {
			const imagePath = req.files.car_image[0].path;
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		if (req.files.cv) {
			const cvPath = req.files.cv[0].path;
			if (fs.existsSync(cvPath)) {
				fs.unlinkSync(cvPath);
			}
		}

		if (req.files.image) {
			const imagePath = req.files.image[0].path;
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}
	}

	if (err.statusCode) {
		return res.status(err.statusCode).json({ message: err.message });
	}

	// UniqueConstraintError
	else if (err instanceof UniqueConstraintError) {
		const details = err.errors.map((e) => {
			return {
				field: e.path,
				message: e.message,
			};
		});

		return res.status(409).json({
			message: "Duplicate Values are not allowed",
			details,
		});
	}

	// ForeignKeyConstraintError
	else if (err instanceof ForeignKeyConstraintError) {
		return res.status(400).json({
			message:
				"Invalid foreign key reference. The related record does not exist.",
			fields: err.fields,
		});
	}

	// ValidationError
	else if (err instanceof ValidationError) {
		const details = err.errors.map((e) => {
			return {
				field: e.path,
				message: e.message,
				type: e.type,
				info: e.path === "PRIMARY" ? "Entity is already existed" : null,
			};
		});

		return res.status(422).json({ message: "Validation Failed", details });
	}

	res.status(500).json({ message: "Internal Server Error", errMessage: err });
};

module.exports = errorHandler;

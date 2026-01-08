const multer = require("multer");

const path = require("node:path");

const fileName = (_req, file, cb) => {
	cb(null, `file-${Date.now() * 9}${path.extname(file.originalname)}`);
};

const addnewType = (newType = "") => {
	return (_req, file, cb) => {
		let allowedMimeTypes = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/bmp",
			"image/tiff",
		];

		let errorMsg = "Only Images Are Allowed";

		if (newType === "videos") {
			allowedMimeTypes = [
				"video/mp4",
				"video/webm",
				"video/ogg",
				"video/x-msvideo",
				"video/x-matroska",
				"video/quicktime",
				"video/x-flv",
				"video/3gpp",
				"video/3gpp2",
				"video/mpeg",
				"video/x-ms-wmv",
			];

			errorMsg = "Only videos are allowed";
		} else if (newType === "pdf") {
			allowedMimeTypes.push("application/pdf");

			errorMsg = "Only Images and PDF files are allowed";
		}

		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			const error = new Error(errorMsg);
			error.custom = true;
			cb(error, false);
		}
	};
};

function setDistinationAndFileType(destination, newType = "") {
	const storage = multer.diskStorage({
		destination: `./uploads/${destination}`,

		filename: fileName,
	});

	return multer({ storage: storage, fileFilter: addnewType(newType) });
}

module.exports = setDistinationAndFileType;

const { MulterError } = require("multer");

function uploadMiddleware(uploadFn) {
	return (req, res, next) => {
		uploadFn(req, res, (err) => {
			if (err instanceof MulterError) {
				console.error(err);

				return res.status(400).json({ message: err.message });
			}
			if (err) {
				if (err.custom) {
					return res.status(409).json({ message: err.message });
				}
				console.error(err);
				next(err);
			}

			next();
		});
	};
}

module.exports = uploadMiddleware;

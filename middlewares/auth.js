const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
	const authHeaders = req.headers.authorization || req.headers.Authorization;

	if (!authHeaders) {
		return res.status(404).json({ message: "No Token Found" });
	}

	const token = authHeaders.split(" ")[1];

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		req.userId = decodedToken.userId;
		req.userRole = decodedToken.role;
		req.protectorId = decodedToken.protectorId;

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				message: "Your Token has expired. Please log in again.",
			});
		}

		return res.status(401).json({ message: "Invalid Token" });
	}
};

const decodeToken = (req, res, next) => {
	const authHeaders = req.headers.authorization || req.headers.Authorization;

	if (!authHeaders) {
		return next();
	}

	const token = authHeaders.split(" ")[1];

	try {
		const decodedToken = jwt.decode(token);

		req.userId = decodedToken.userId;
		req.userRole = decodedToken.role;

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({
				message: "Your Token has expired. Please log in again.",
			});
		}

		return res.status(401).json({ message: "Invalid Token" });
	}
};

module.exports = {
	decodeToken,
	checkAuth,
};

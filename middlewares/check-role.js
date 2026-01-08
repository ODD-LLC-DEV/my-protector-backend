function checkRole(...requiredRoles) {
	return (req, res, next) => {
		if (!requiredRoles.includes(req.userRole)) {
			return res.status(403).json({ message: "Access Denied" });
		}
		return next();
	};
}

module.exports = checkRole;

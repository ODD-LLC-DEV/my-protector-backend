const User = require("../models/User");
const sendNotification = require("../utils/send-notification");

const sendAlertNotification = async (req, res) => {
	const { protector_id } = req.body;

	const userId = req.userId;

	if (!protector_id) {
		return res.status(400).json({ message: "Protector Id is Required" });
	}

	const protector = await User.findByPk(protector_id, {
		attributes: ["email"],
	});

	const customer = await User.findByPk(userId, {
		attributes: ["name", "phone_number"],
		raw: true,
	});

	if (!protector) {
		return res.status(404).json({ message: "User Not Found" });
	}

	await sendNotification(
		"Urgent Potential Danger Detected",
		`${customer.name} needs you`,
		customer.phone_number,
		protector.email,
	);

	res.status(200).json({ message: "Notification is Sent Successfully" });
};

module.exports = {
	sendAlertNotification,
};

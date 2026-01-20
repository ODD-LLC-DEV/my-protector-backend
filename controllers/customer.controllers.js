const User = require("../models/User");
const sendNotification = require("../utils/send-notification");

const sendAlertNotification = async (req, res) => {
	const { protector_id } = req.body;

	if (!protector_id) {
		return res.status(400).json({ message: "Protector Id is Required" });
	}

	const protector = await User.findByPk(protector_id, {
		attributes: ["email"],
		raw: true,
	});

	if (!protector) {
		return res.status(404).json({ message: "User Not Found" });
	}

	await sendNotification("Test", "tetaoafokamforkaowfrk");

	res.status(200).json({ message: "Notification is Sent Successfully" });
};

const getLastCordinatestOfProtectors = async (req, res) => {};

module.exports = {
	sendAlertNotification,
};

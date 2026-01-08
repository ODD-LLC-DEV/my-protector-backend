const { Op } = require("sequelize");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const getChatsForProtector = async (req, res) => {
	const userId = req.userId;

	const chats = await Chat.findAll({
		attributes: ["id", "last_msg", "last_msg_seen"],
		where: {
			protector_id: userId,
		},
		include: [
			{
				model: User,
				attributes: ["id", "name", "image_link"],
				as: "customer",
			},
		],
		order: [["last_msg_sent_at", "DESC"]],
	});

	res.status(200).json({ data: chats });
};

const getChatMessagesForCustomer = async (req, res) => {
	const userId = req.userId;

	const { protector_id } = req.params;

	const messages = await Message.findAll({
		where: {
			[Op.or]: [
				{ sender_id: userId, receiver_id: protector_id },
				{ sender_id: protector_id, receiver_id: userId },
			],
		},
		order: [["id", "DESC"]],
	});

	res.status(200).json({ data: messages });
};

const getChatMessagesForProtector = async (req, res) => {
	const { id } = req.params;

	const messages = await Message.findAll({
		where: {
			chat_id: id,
		},
		order: [["id", "DESC"]],
	});

	res.status(200).json({ data: messages });
};

module.exports = {
	getChatsForProtector,
	getChatMessagesForCustomer,
	getChatMessagesForProtector,
};

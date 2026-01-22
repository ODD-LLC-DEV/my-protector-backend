const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const sequelize = require("./config/db.js");
const Chat = require("./models/Chat.js");
const Message = require("./models/Message.js");
const emitter = require("./config/event-emitter.js");

const connectedUsers = new Map();

function handleUsersConnection(io) {
	io.on("connection", (socket) => {
		const userId = socket.userId;

		console.log(`${socket.userRole} ${userId} is Connected`);

		socket.on("send-message", async ({ chat_id, message, receiver_id }) => {
			console.log({ chat_id, message, receiver_id });

			console.log("ssssssssssssssssss", chat_id);

			console.log(connectedUsers);

			await sendMessageBetweenUsers(chat_id, message, receiver_id, socket);
		});

		if (socket.userRole === "Customer") {
			emitter.on("send-live-data", (data) => {
				const locationData = socket.to(socket.id).emit("send-live-location");
			});
		}

		socket.on("disconnect", () => {
			console.log(`${socket.userRole} ${userId} disconnect`);

			connectedUsers.delete(userId);
		});
	});
}

function createSocketIoServer(server) {
	const io = new Server(server, {
		// ors: {
		// 	origin: "*",
		// 	methods: ["GET", "POST"],
		// },
	});

	io.use(checkAuthMiddleware);

	handleUsersConnection(io);
}

function checkAuthMiddleware(socket, next) {
	const authorizationHeader = socket.request.headers.authorization;

	if (!authorizationHeader) {
		next(new Error("No Token Found"));
	}

	const token = authorizationHeader.split(" ")[1];

	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

	socket.userRole = decodedToken.role;

	connectedUsers.set(decodedToken.userId, socket.id);

	socket.userId = decodedToken.userId;

	next();
}

async function sendMessageBetweenUsers(chat_id, message, receiver_id, socket) {
	console.log(socket.id);

	const role = socket.userRole;

	let protector_id, customer_id;

	if (role === "Customer") {
		customer_id = socket.userId;

		protector_id = receiver_id;
	} else {
		customer_id = receiver_id;

		protector_id = socket.userId;
	}

	if (!chat_id) {
		newChatId = await sequelize.transaction(async (transaction) => {
			const [chat] = await Chat.findOrCreate({
				attributes: ["id"],
				where: {
					protector_id,
					customer_id,
				},
				raw: true,
				defaults: {
					last_msg: message,
					last_msg_sent_at: new Date(),
					protector_id: receiver_id,
					customer_id: socket.userId,
					last_sender: role,
				},
				transaction,
			});

			await Message.create(
				{
					sender_id: socket.userId,
					receiver_id,
					chat_id: chat.id,
					text: message,
				},
				{
					transaction,
				},
			);

			return chat.id;
		});
	} else {
		await Message.create({
			chat_id,
			sender_id: socket.userId,
			receiver_id,
			text: message,
		});
	}

	const socketId = connectedUsers.get(Number(receiver_id));

	// this mean that the user is online
	if (socketId) {
		console.log(socketId);
		socket.to(socketId).emit("receive-message", message);

		await Chat.update(
			{
				last_msg_seen: true,
				last_msg: message,
				last_msg_sent_at: new Date(),
				last_sender: role,
			},
			{
				where: {
					protector_id,
					customer_id,
				},
			},
		);
	} else {
		console.log(chat_id, "sssssssssssssssss");

		if (chat_id) {
			await Chat.update(
				{
					last_msg_seen: true,
					last_msg: message,
					last_msg_sent_at: new Date(),
					last_sender: role,
				},
				{
					where: {
						id: chat_id,
					},
				},
			);
		} else {
			await Chat.update(
				{
					last_msg_seen: false,
					last_msg: message,
					last_msg_sent_at: new Date(),
					last_sender: role,
				},
				{
					where: {
						protector_id,
						customer_id,
					},
				},
			);
		}
	}
}

module.exports = createSocketIoServer;

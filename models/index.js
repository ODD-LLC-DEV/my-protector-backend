const Booking = require("./Booking");
const CarData = require("./Car-Data");
const Chat = require("./Chat");
const Driver = require("./Driver");
const DriverBooking = require("./Driver-Booking");
const Guard = require("./Guard");
const GuardBooking = require("./Guard-Booking");
const Guide = require("./Guide");
const Message = require("./Message");
const PasswordReset = require("./Password-Reset");
const Translator = require("./Translator");
const TranslatorBooking = require("./Translator-Booking");
const User = require("./User");
const GuideBooking = require("./Guide-Booking");

function setRelationships() {
	User.hasOne(PasswordReset, { foreignKey: "user_id" });
	PasswordReset.belongsTo(User, { foreignKey: "user_id" });

	// ========================================================================

	User.hasOne(Guard, { foreignKey: "user_id" });
	Guard.belongsTo(User, { foreignKey: "user_id" });

	// ========================================================================

	User.hasMany(Booking, { foreignKey: "user_id" });
	Booking.belongsTo(User, { foreignKey: "user_id" });

	// ========================================================================

	Guard.belongsToMany(Booking, {
		through: {
			model: GuardBooking,
			unique: false,
		},
		foreignKey: "guard_id",
		otherKey: "booking_id",
	});

	Booking.belongsToMany(Guard, {
		through: {
			model: GuardBooking,
			unique: false,
		},
		foreignKey: "booking_id",
		otherKey: "guard_id",
	});

	// ========================================================================

	Driver.belongsToMany(Booking, {
		through: {
			model: DriverBooking,
			unique: false,
		},
		foreignKey: "driver_id",
		otherKey: "booking_id",
	});

	Booking.belongsToMany(Driver, {
		through: {
			model: DriverBooking,
			unique: false,
		},
		foreignKey: "booking_id",
		otherKey: "driver_id",
	});

	// ========================================================================

	Translator.belongsToMany(Booking, {
		through: {
			model: TranslatorBooking,
			unique: false,
		},
		foreignKey: "translator_id",
		otherKey: "booking_id",
	});

	Booking.belongsToMany(Translator, {
		through: {
			model: TranslatorBooking,
			unique: false,
		},
		foreignKey: "booking_id",
		otherKey: "translator_id",
	});

	// ========================================================================

	User.hasOne(Translator, { foreignKey: "user_id" });
	Translator.belongsTo(User, { foreignKey: "user_id" });

	// ========================================================================

	User.hasOne(Driver, { foreignKey: "user_id" });
	Driver.belongsTo(User, { foreignKey: "user_id" });

	// ========================================================================

	Chat.hasMany(Message, { foreignKey: "chat_id" });
	Message.belongsTo(Chat, { foreignKey: "chat_id" });

	// ========================================================================

	User.hasMany(Message, { foreignKey: "sender_id", as: "sent_messages" });
	Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

	// ========================================================================

	User.hasMany(Message, { foreignKey: "receiver_id", as: "received_messages" });
	Message.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

	// ========================================================================

	User.hasMany(Chat, { foreignKey: "customer_id", as: "customer_chats" });
	Chat.belongsTo(User, { foreignKey: "customer_id", as: "customer" });

	// ========================================================================

	User.hasMany(Chat, { foreignKey: "protector_id", as: "protector_chats" });
	Chat.belongsTo(User, { foreignKey: "protector_id", as: "protector" });

	// ========================================================================

	Driver.hasOne(CarData, { foreignKey: "driver_id" });
	CarData.belongsTo(Driver, { foreignKey: "driver_id" });

	// ========================================================================

	User.hasOne(Guide, { foreignKey: "user_id" });
	Guide.belongsTo(User, { foreignKey: "user_id" });

	// ========================================================================

	Guide.belongsToMany(Booking, {
		through: {
			model: GuideBooking,
			unique: false,
		},
		foreignKey: "guide_id",
		otherKey: "booking_id",
	});

	Booking.belongsToMany(Guide, {
		through: {
			model: GuideBooking,
			unique: false,
		},
		foreignKey: "booking_id",
		otherKey: "guide_id",
	});
}

module.exports = setRelationships;

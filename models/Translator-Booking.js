const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Translator = require("./Translator");
const Booking = require("./Booking");

const TranslatorBooking = sequelize.define(
	"Translator_Booking",
	{
		id: {
			type: DataTypes.INTEGER({ unsigned: true }),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		translator_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Translator,
				key: "id",
			},
		},
		booking_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Booking,
				key: "id",
			},
		},
	},
	{
		timestamps: false,
	},
);

module.exports = TranslatorBooking;

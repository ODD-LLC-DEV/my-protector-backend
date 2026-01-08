const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Guard = require("./Guard");
const Booking = require("./Booking");

const GuardBooking = sequelize.define(
	"Guard_Booking",
	{
		guard_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Guard,
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

module.exports = GuardBooking;

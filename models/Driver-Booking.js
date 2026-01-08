const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Driver = require("./Driver");
const Booking = require("./Booking");

const DriverBooking = sequelize.define(
	"Driver_Booking",
	{
		driver_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Driver,
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

module.exports = DriverBooking;

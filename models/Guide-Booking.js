const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Guide = require("./Guide");
const Booking = require("./Booking");

const GuideBooking = sequelize.define(
	"Guide_Booking",
	{
		id: {
			type: DataTypes.INTEGER({ unsigned: true }),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		guide_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Guide,
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

module.exports = GuideBooking;

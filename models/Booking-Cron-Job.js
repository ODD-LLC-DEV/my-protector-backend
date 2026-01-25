const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BookingCronJob = sequelize.define(
	"Booking_Cron_Job",
	{
		job_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		booking_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	},
);

module.exports = BookingCronJob;

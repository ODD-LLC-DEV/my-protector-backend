const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const PasswordReset = sequelize.define(
	"Password_Reset",
	{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		no_of_tries: {
			type: DataTypes.TINYINT({ unsigned: true }),
			allowNull: false,
		},
		otp: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		updatedAt: false,
		createdAt: "otp_created_at",
		indexes: [{ fields: ["email"], unique: true }],
	},
);

module.exports = PasswordReset;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Driver = sequelize.define(
	"Driver",
	{
		gender: {
			type: DataTypes.ENUM("Male", "Female"),
			allowNull: false,
		},
		age: {
			type: DataTypes.TINYINT({ unsigned: true }),
			allowNull: false,
		},
		weight: {
			type: DataTypes.FLOAT(5, 2),
			allowNull: false,
		},
		height: {
			type: DataTypes.FLOAT(5, 2),
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("ACCEPTED", "REJECTED", "PENDING"),
			allowNull: false,
			defaultValue: "PENDING",
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
	},
	{
		timestamps: false,
		indexes: [{ fields: ["user_id"], unique: true }],
	},
);

module.exports = Driver;

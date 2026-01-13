const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Guard = sequelize.define(
	"Guard",
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
		skills: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		video_link: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("ACCEPTED", "REJECTED", "PENDING"),
			allowNull: false,
			defaultValue: "PENDING",
		},
		price: {
			type: DataTypes.MEDIUMINT({ unsigned: true }),
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
	},
	{
		timestamps: false,
		indexes: [{ fields: ["user_id"], unique: true }],
	},
);

module.exports = Guard;

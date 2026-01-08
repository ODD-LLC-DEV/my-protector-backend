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
		image_link: {
			type: DataTypes.STRING,
			allowNull: false,
			get() {
				const value = this.getDataValue("image_link");

				return `${process.env.BASE_URL}/api/${value}`;
			},
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
	},
);

module.exports = Driver;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
	"User",
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM(
				"Customer",
				"Driver",
				"Guard",
				"Translator",
				"Guide",
			),
			allowNull: false,
		},
		image_link: {
			type: DataTypes.STRING,
			get() {
				const value = this.getDataValue("image_link");

				return value ? `${process.env.BASE_URL}/api/${value}` : value;
			},
		},
	},
	{
		timestamps: false,
		indexes: [
			{ fields: ["email"], unique: true },
			{ fields: ["phone_number"], unique: true },
		],
	},
);

module.exports = User;

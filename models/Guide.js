const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Guide = sequelize.define(
	"Guide",
	{
		gender: {
			type: DataTypes.ENUM("Male", "Female"),
			allowNull: false,
		},
		age: {
			type: DataTypes.TINYINT({ unsigned: true }),
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

module.exports = Guide;

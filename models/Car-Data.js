const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Driver = require("./Driver");

const CarData = sequelize.define(
	"Car_Data",
	{
		brand: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		model_year: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		license_image_link: {
			type: DataTypes.STRING,
			allowNull: false,
			get() {
				const value = this.getDataValue("license_image_link");

				return `${process.env.BASE_URL}/api/${value}`;
			},
		},
		car_image_link: {
			type: DataTypes.STRING,
			allowNull: false,
			get() {
				const value = this.getDataValue("car_image_link");

				return `${process.env.BASE_URL}/api/${value}`;
			},
		},
		price: {
			type: DataTypes.MEDIUMINT({ unsigned: true }),
			allowNull: false,
		},
		driver_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Driver,
				key: "id",
			},
		},
	},
	{
		timestamps: false,
		indexes: [{ fields: ["driver_id"], unique: true }],
	},
);

module.exports = CarData;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Booking = sequelize.define(
	"Booking",
	{
		pickup_country: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pickup_city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pickup_street: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pickup_building_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pickup_longitude: {
			type: DataTypes.DECIMAL(9, 6),
			allowNull: false,
		},
		pickup_latitude: {
			type: DataTypes.DECIMAL(9, 6),
			allowNull: false,
		},
		pickup_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		pickup_time: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		protection_duration: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dress_code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		no_of_guards: {
			type: DataTypes.SMALLINT({ unsigned: true }),
			allowNull: false,
			defaultValue: 1,
		},
		no_of_cars: {
			type: DataTypes.SMALLINT({ unsigned: true }),
			allowNull: false,
			defaultValue: 1,
		},
		no_of_protectees: {
			type: DataTypes.MEDIUMINT({ unsigned: true }),
			allowNull: false,
			defaultValue: 1,
		},
		guard_gender: {
			type: DataTypes.ENUM("Male", "Female"),
			allowNull: false,
		},
		add_translator: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		translator_lang: {
			type: DataTypes.STRING,
		},
		add_guide: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		total_price: {
			type: DataTypes.MEDIUMINT({ unsigned: true }),
			allowNull: false,
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
		updatedAt: false,
		createdAt: true,
	},
);

module.exports = Booking;

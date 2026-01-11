const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Chat = sequelize.define(
	"Chat",
	{
		last_msg: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last_sender: {
			type: DataTypes.ENUM("Guard", "Customer", "Driver", "Translator"),
			allowNull: false,
		},
		last_msg_seen: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		last_msg_sent_at: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		customer_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		protector_id: {
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

module.exports = Chat;

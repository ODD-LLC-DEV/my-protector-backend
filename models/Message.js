const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Chat = require("./Chat");

const Message = sequelize.define(
	"Message",
	{
		text: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		sender_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		receiver_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		chat_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Chat,
				key: "id",
			},
		},
	},
	{
		timestamps: false,
	},
);

module.exports = Message;

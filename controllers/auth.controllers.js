const User = require("../models/User");
const { hashSync, compareSync } = require("bcryptjs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const PasswordReset = require("../models/Password-Reset");
const sequelize = require("../config/db");
const Admin = require("../models/Admin");
const CarData = require("../models/Car-Data");

const signup = async (req, res) => {
	const { name, email, phone_number, password, role } = req.body || {};

	if (!name || !email || !phone_number || !password || !role) {
		return res.status(400).json({ message: "Missing Required Fields" });
	}

	const user = await User.findOne({
		where: {
			[Op.or]: [{ email }, { phone_number }],
		},
		attributes: ["id"],
		raw: true,
	});

	if (user) {
		return res.status(409).json({ message: "User Already Exist" });
	}

	const hashedPassword = hashSync(password, 12);

	const createdUser = await User.create({
		name,
		email,
		phone_number,
		role,
		password: hashedPassword,
	});

	res.status(201).json({
		message: "User Registered Successfully",
		user_id: createdUser.id,
		role: createdUser.role,
	});
};

const loginUser = async (req, res) => {
	const { identifier, password } = req.body || {};

	const user = await User.findOne({
		where: {
			[Op.or]: [{ email: identifier }, { phone_number: identifier }],
		},
		attributes: ["id", "password", "role", "image_link"],
	});

	if (!user) {
		return res.status(404).json({ message: "Invalid Identifier or Password" });
	}

	const isPasswordValid = compareSync(password, user.password);

	if (!isPasswordValid) {
		return res.status(401).json({ message: "Invalid Identifier or Password" });
	}

	const payload = { userId: user.id, role: user.role };

	if (user.role !== "Customer") {
		const customUser = await sequelize.models[user.role].findOne({
			where: {
				user_id: user.id,
			},
			attributes: ["id", "status"],
			raw: true,
		});

		if (!customUser) {
			return res.status(401).json({
				message: "No Custom Data Found Please fill your data before login",
				user_id: user.id,
				role: user.role,
			});
		}

		if (user.role === "Driver") {
			const car = await CarData.findOne({
				where: {
					driver_id: customUser.id,
				},
				attributes: ["id"],
				raw: true,
			});

			if (!car) {
				return res.status(401).json({
					message: "Please fill the car data first",
					driver_id: customUser.id,
				});
			}
		}

		if (customUser.status === "REJECTED") {
			return res.status(400).json({
				message: "Your account is rejected by admin",
			});
		}

		if (customUser.status === "PENDING") {
			return res.status(400).json({
				message: "Your account is pending approval by admin",
			});
		}

		payload.protectorId = customUser.id;
	}

	const token = jwt.sign(payload, process.env.JWT_SECRET);

	res.status(200).json({
		message: "User Logged In Successfully",
		token,
		role: user.role,
		image_link: user.image_link,
		user_id: user.id,
	});
};

const sendResetPasswordOtp = async (req, res) => {
	const { email } = req.body || {};

	if (!email) {
		return res.status(400).json({ message: "Email is Required" });
	}

	const user = await User.findOne({
		where: {
			email,
		},
		attributes: ["id", "email"],
		raw: true,
	});

	if (!user) {
		return res.status(404).json({ message: "User Not Found" });
	}

	// send otp

	const otp = Math.floor(100000 + Math.random() * 900000);

	await PasswordReset.upsert({
		email,
		otp,
		is_verified: false,
		no_of_tries: 0,
		otp_created_at: new Date(),
	});

	res.status(200).json({ message: "Password Reset Otp is Sent Successfully" });
};

const verifyResetOtp = async (req, res) => {
	const { email, otp } = req.body || {};

	if (!email || !otp) {
		return res.status(400).json({ message: "Email and Otp are Required" });
	}

	const verification = await PasswordReset.findOne({
		where: {
			email,
		},
		attributes: ["id", "otp", "no_of_tries"],
		raw: true,
	});

	if (!verification) {
		return res.status(404).json({ message: "Verification Not Found" });
	}

	if (verification.no_of_tries >= 3) {
		return res.status(400).json({ message: "Otp is Expired" });
	}

	if (verification.otp !== otp) {
		await PasswordReset.increment(
			{
				no_of_tries: 1,
			},
			{
				where: {
					email,
				},
			},
		);
		return res.status(400).json({ message: "Invalid Otp" });
	}

	await PasswordReset.update(
		{
			is_verified: true,
		},
		{
			where: {
				email,
			},
		},
	);

	res.status(200).json({ message: "Otp is Verified Successfully" });
};

const changePassword = async (req, res) => {
	const { email, new_password } = req.body || {};

	if (!new_password || !email) {
		return res.status(400).json({
			message: "New Password and email are Required",
		});
	}

	const verification = await PasswordReset.findOne({
		where: {
			email,
		},
		attributes: ["id", "is_verified"],
		raw: true,
	});

	if (!verification) {
		return res.status(404).json({ message: "User Not Found" });
	}

	if (!verification.is_verified) {
		return res.status(400).json({ message: "Otp is Not Verified" });
	}

	const hashedPassword = hashSync(new_password, 12);

	const user = await User.findOne({
		where: { email },
		raw: true,
		attributes: ["id"],
	});

	await sequelize.transaction(async (transaction) => {
		await User.update(
			{
				password: hashedPassword,
			},
			{
				where: {
					id: user.id,
				},
			},
		);

		await PasswordReset.update(
			{
				is_verified: false,
				user_id: user.id,
			},
			{
				where: {
					id: verification.id,
				},
				transaction,
			},
		);
	});

	res.status(200).json({ message: "Password is Changed Successfully" });
};

const loginAdmin = async (req, res) => {
	const { email, password } = req.body || {};

	if (!email || !password) {
		return res.status(400).json({ message: "Email and Password are Required" });
	}

	const admin = await Admin.findOne({
		where: {
			email,
		},
		attributes: ["id", "password"],
		raw: true,
	});

	if (!admin) {
		return res.status(401).json({ message: "Invalid Email or Password" });
	}

	const isPasswordValid = compareSync(password, admin.password);

	if (!isPasswordValid) {
		return res.status(401).json({ message: "Invalid Email or Password" });
	}

	const token = jwt.sign(
		{ adminId: admin.id, role: "ADMIN" },
		process.env.JWT_SECRET,
		{ expiresIn: "2d" },
	);

	res.status(200).json({
		message: "Admin Logged In Successfully",
		token,
	});
};

module.exports = {
	signup,
	loginUser,
	sendResetPasswordOtp,
	verifyResetOtp,
	changePassword,
	loginAdmin,
};

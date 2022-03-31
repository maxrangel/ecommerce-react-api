const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const { AppError } = require('../utils/appError');
const { db } = require('../utils/database');

const User = db.define(
	'user',
	{
		id: {
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		firstName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		role: {
			type: DataTypes.STRING(10),
			allowNull: false,
			defaultValue: 'normal',
		},
		status: {
			type: DataTypes.STRING(20),
			allowNull: false,
			// available | deleted | banned
			defaultValue: 'available',
		},
	},
	{ timestamps: false }
);

User.addHook('beforeCreate', async (user, options) => {
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash(user.password, salt);

	user.password = hashedPassword;
});

module.exports = { User };

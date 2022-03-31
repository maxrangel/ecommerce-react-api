const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');
const { AppError } = require('../utils/appError');

const Product = db.define(
	'product',
	{
		id: {
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		brand: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		categoryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(20),
			allowNull: 'false',
			// active | deleted | soldOut
			defaultValue: 'active',
			validate: {
				checkStatus(val) {
					const status = ['active', 'deleted', 'soldOut'];

					if (!status.includes(val))
						throw new AppError('Not a valid status', 500);
				},
			},
		},
	},
	{ timestamps: false }
);

module.exports = { Product };

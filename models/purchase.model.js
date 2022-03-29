const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const Purchase = db.define(
	'purchase',
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
		cartId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		references: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{ timestamps: false }
);

module.exports = { Purchase };

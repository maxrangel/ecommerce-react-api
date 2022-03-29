const { DataTypes } = require('sequelize');

// Utils
const { db } = require('../utils/database');

const Category = db.define(
	'category',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(20),
			allowNull: false,
			// active | removed | purchased
			defaultValue: 'active',
		},
	},
	{ timestamps: false }
);

module.exports = { Category };

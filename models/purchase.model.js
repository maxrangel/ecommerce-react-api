const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const Purchase = db.define('purchase', {
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
});

module.exports = { Purchase };

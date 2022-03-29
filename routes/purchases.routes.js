const express = require('express');

// Controllers
const {
	getAllPurchases,
	getPurchaseById,
	purchaseCart,
} = require('../controllers/purchases.controller');

const { protectSession } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protectSession);

router.route('/').get(getAllPurchases).post(purchaseCart);

router.route('/:id').get(getPurchaseById);

module.exports = { purchasesRouter: router };

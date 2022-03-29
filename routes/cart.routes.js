const express = require('express');

// Controllers
const {
	addProductToCart,
	getUserCart,
	updateProductCart,
	removeProductFromCart,
	purchaseOrder,
} = require('../controllers/cart.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protectSession);

// Add product to cart
router
	.route('/')
	.get(getUserCart)
	.post(addProductToCart)
	.patch(updateProductCart);

router.route('/:id').delete(removeProductFromCart);

module.exports = { cartRouter: router };

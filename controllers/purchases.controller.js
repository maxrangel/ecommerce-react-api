// Models
const { Product } = require('../models/product.model');
const { Cart } = require('../models/cart.model');
const { Purchase } = require('../models/purchase.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.purchaseCart = catchAsync(async (req, res, next) => {
	const { currentUser } = req;

	// 1st part:
	// Get user's cart and get the products of the cart
	const cart = await Cart.findOne({
		where: { userId: currentUser.id, status: 'onGoing' },
		include: [
			{
				model: Product,
				through: { where: { status: 'active' } },
			},
		],
	});

	if (!cart) return next(new AppError('Cart not found', 404));

	await Purchase.create({
		userId: currentUser.id,
		cartId: cart.id,
	});

	// Set Cart status to 'purchased'
	await cart.update({ status: 'purchased' });

	// Loop through the products array, for each product
	const promises = cart.products.map(async product => {
		// Set productInCart status to 'purchased'
		return await product.productsInCart.update({ status: 'purchased' });
	});

	await Promise.all(promises);

	res.status(200).json({ status: 'success' });
});

// Create a controller a function that gets all the user's orders
exports.getAllPurchases = catchAsync(async (req, res, next) => {
	const { currentUser } = req;

	const purchases = await Purchase.findAll({
		where: { userId: currentUser.id },
		include: [
			{
				model: Cart,
				include: [
					{
						model: Product,
						through: { where: { status: 'purchased' } },
					},
				],
			},
		],
	});

	res.status(200).json({
		status: 'success',
		data: { purchases },
	});
});
// The response must include all products that purchased

exports.getPurchaseById = catchAsync(async (req, res, next) => {
	const { currentUser } = req;
	const { id } = req.params;

	const purchase = await Purchase.findOne({
		where: { id, userId: currentUser.id },
		include: [
			{
				model: Cart,
				include: [
					{
						model: Product,
						through: { where: { status: 'purchased' } },
					},
				],
			},
		],
	});

	if (!purchase) {
		return next(new AppError('No purchase found', 404));
	}

	res.status(200).json({
		status: 'success',
		data: { purchase },
	});
});

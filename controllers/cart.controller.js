// Models
const { Product } = require('../models/product.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.getUserCart = catchAsync(async (req, res, next) => {
	const { currentUser } = req;

	const cart = await Cart.findOne({
		attributes: { exclude: ['userId', 'status'] },
		where: { userId: currentUser.id, status: 'onGoing' },
		include: [
			{
				model: Product,
				through: { where: { status: 'active' } },
			},
		],
	});

	if (!cart) return next(new AppError('Cart not found', 404));

	res.status(200).json({
		status: 'success',
		data: { cart },
	});
});

exports.addProductToCart = catchAsync(async (req, res, next) => {
	const { currentUser } = req;
	const { id, quantity } = req.body;

	// Validate if quantity is less or equal to existing quantity
	const productExists = await Product.findOne({
		where: { id, status: 'active' },
	});

	if (!productExists) {
		return next(new AppError('Product does not exists', 400));
	}

	// Check if current user already has a cart
	const cart = await Cart.findOne({
		where: { userId: currentUser.id, status: 'onGoing' },
	});

	// Create new cart
	if (!cart) {
		const newCart = await Cart.create({ userId: currentUser.id });

		await ProductInCart.create({
			cartId: newCart.id,
			productId: id,
			quantity: quantity,
		});
	}

	// Update cart
	if (cart) {
		// Check if product already exists on the cart
		const productInCartExists = await ProductInCart.findOne({
			where: {
				cartId: cart.id,
				productId: id,
				status: 'active',
			},
		});

		if (productInCartExists) {
			return next(
				new AppError('You already added this product to the cart', 400)
			);
		}

		// Add it to the cart
		await ProductInCart.create({
			cartId: cart.id,
			productId: id,
			quantity,
		});
	}

	res.status(201).json({ status: 'success' });
});

exports.updateProductCart = catchAsync(async (req, res, next) => {
	const { currentUser } = req;
	const { id, newQuantity } = req.body;

	// Find user's cart
	const userCart = await Cart.findOne({
		where: { userId: currentUser.id, status: 'onGoing' },
	});

	if (!userCart) {
		return next(new AppError('Invalid cart', 400));
	}

	// Find product in cart
	const productInCart = await ProductInCart.findOne({
		where: {
			productId: id,
			cartId: userCart.id,
			status: 'active',
		},
	});

	if (!productInCart) {
		return next(new AppError('Invalid product', 400));
	}

	if (newQuantity === productInCart.quantity) {
		return next(
			new AppError('You already have that quantity in that product', 400)
		);
	}

	// Check if user added or removed from the selected product
	// If user send 0 quantity to product, remove it from the cart
	if (newQuantity === 0) {
		// Update quantity to product in cart
		await productInCart.update({ quantity: 0, status: 'removed' });
	}

	if (newQuantity > 0) {
		await productInCart.update({ quantity: newQuantity });
	}

	res.status(204).json({ status: 'success' });
});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
	const { currentUser } = req;
	const { id } = req.params;

	// Find user's cart
	const userCart = await Cart.findOne({
		where: { userId: currentUser.id, status: 'onGoing' },
	});

	if (!userCart) {
		return next(new AppError('Invalid cart', 400));
	}

	// Find product in cart
	const productInCart = await ProductInCart.findOne({
		where: {
			productId: id,
			cartId: userCart.id,
			status: 'active',
		},
	});

	if (!productInCart) {
		return next(new AppError('Invalid product', 400));
	}

	await productInCart.update({ status: 'removed', quantity: 0 });

	res.status(204).json({ status: 'success' });
});

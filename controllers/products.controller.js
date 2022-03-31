const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { Op } = require('sequelize');

// Models
const { Product } = require('../models/product.model');
const { ProductImg } = require('../models/productImg.model');
const { User } = require('../models/user.model');
const { Category } = require('../models/category.model');

// Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { filterObj } = require('../utils/filterObj');
const { firebaseStorage } = require('../utils/firebase');
const { formatProducts, formatProduct } = require('../utils/queryFormat');

// Products functions
exports.getAllProducts = catchAsync(async (req, res, next) => {
	const products = await Product.findAll({
		where: {
			status: 'active',
			title: { [Op.substring]: req.query.query || '' },
		},
		include: [
			{
				model: User,
				attributes: { exclude: ['password'] },
			},
			{
				model: ProductImg,
				where: { status: 'active' },
				attributes: ['imgPath'],
			},
			{
				model: Category,
				where: req.query.category ? { id: req.query.category } : null,
			},
		],
	});

	const productsPromises = products.map(async product => {
		const imgUrlsPromises = product.productImgs.map(async productImg => {
			const imgRef = ref(firebaseStorage, productImg.imgPath);
			productImg.imgPath = await getDownloadURL(imgRef);
			return productImg;
		});

		const resolvedImgUrls = await Promise.all(imgUrlsPromises);

		// Only return an array of strings with the URLs
		product.productImgs = resolvedImgUrls;

		return product;
	});

	const resolvedProducts = await Promise.all(productsPromises);
	// Get images url from Firebase
	const formattedProducts = formatProducts(resolvedProducts);

	res.status(200).json({
		status: 'success',
		data: { products: formattedProducts },
	});
});

exports.getProductDetails = catchAsync(async (req, res, next) => {
	const { product } = req;

	// Get firebase URL imgs
	const imgUrlsPromises = product.productImgs.map(async productImg => {
		const imgRef = ref(firebaseStorage, productImg.imgPath);
		productImg.imgPath = await getDownloadURL(imgRef);

		return productImg;
	});

	product.productImgs = await Promise.all(imgUrlsPromises);

	const formattedProduct = formatProduct(product);

	res.status(200).json({
		status: 'success',
		data: { product: formattedProduct },
	});
});

exports.createProduct = catchAsync(async (req, res, next) => {
	const { title, description, price, quantity, brand, categoryId } = req.body;
	const { currentUser } = req;

	const newProduct = await Product.create({
		title,
		description,
		price,
		quantity,
		brand,
		categoryId,
		userId: currentUser.id,
	});

	// Save images in firebase
	const imgsPromises = req.files.productImgs.map(async img => {
		const imgName = `/img/products/${newProduct.id}-${currentUser.id}-${img.originalname}`;
		const imgRef = ref(firebaseStorage, imgName);

		const result = await uploadBytes(imgRef, img.buffer);

		await ProductImg.create({
			productId: newProduct.id,
			imgPath: result.metadata.fullPath,
		});
	});

	await Promise.all(imgsPromises);

	res.status(201).json({ status: 'success', data: { newProduct } });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
	const { product } = req;

	const filteredObj = filterObj(
		req.body,
		'name',
		'brand',
		'description',
		'price',
		'quantity',
		'category'
	);

	if (filteredObj.quantity && filteredObj.quantity < 0) {
		return next(new AppError('Invalid product quantity', 400));
	}

	await product.update({
		...filteredObj,
	});

	res.status(204).json({ status: 'success' });
});

exports.disableProduct = catchAsync(async (req, res, next) => {
	const { product } = req;

	await product.update({ status: 'deleted' });

	res.status(204).json({ status: 'success' });
});

exports.getUserProducts = catchAsync(async (req, res, next) => {
	// Based on req.currentUser, get the user's products based on its id
	const { currentUser } = req;

	const products = await Product.findAll({ where: { userId: currentUser.id } });

	res.status(200).json({
		status: 'success',
		data: { products },
	});
});

// Categories functions
exports.getCategories = catchAsync(async (req, res, next) => {
	const categories = await Category.findAll({ where: { status: 'active' } });

	res.status(200).json({
		status: 'success',
		data: { categories },
	});
});

exports.createCategory = catchAsync(async (req, res, next) => {
	const { name } = req.body;

	const newCategory = await Category.create({ name });

	res.status(201).json({
		status: 'success',
		data: { newCategory },
	});
});

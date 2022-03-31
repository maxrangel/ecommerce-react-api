const express = require('express');

// Controller
const {
	createProduct,
	getAllProducts,
	getProductDetails,
	updateProduct,
	disableProduct,
	getUserProducts,
	getCategories,
	createCategory,
} = require('../controllers/products.controller');

// Middlewares
const {
	protectSession,
	protectProductOwner,
	protectAdmin,
} = require('../middlewares/auth.middleware');
const {
	createProductValidations,
	createCategoryValidations,
	validateResult,
} = require('../middlewares/validators.middleware');
const { productExists } = require('../middlewares/products.middleware');

const { multerUpload } = require('../utils/multer'); // multipart/form-data

const router = express.Router();

// Get all products
// Create new product
router
	.route('/')
	.get(getAllProducts)
	.post(
		multerUpload.fields([{ name: 'productImgs', maxCount: 3 }]),
		protectSession,
		protectAdmin,
		// multerUpload.single('productImg'),
		createProductValidations,
		validateResult,
		createProduct
	);

// Get produts listed by the user
router.get('/user-products', protectSession, getUserProducts);

// Get products' categories
router
	.route('/categories')
	.get(getCategories)
	.post(
		protectSession,
		protectAdmin,
		createCategoryValidations,
		validateResult,
		createCategory
	);

// Get product's details
// Update product
// Remove product
router
	.use('/:id', productExists)
	.route('/:id')
	.get(getProductDetails)
	.patch(protectSession, protectAdmin, protectProductOwner, updateProduct)
	.delete(protectSession, protectAdmin, protectProductOwner, disableProduct);

module.exports = { productsRouter: router };

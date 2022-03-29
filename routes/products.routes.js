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
} = require('../middlewares/auth.middleware');
const {
	createProductValidations,
	createCategoryValidations,
	validateResult,
} = require('../middlewares/validators.middleware');
const { productExists } = require('../middlewares/products.middleware');

const { multerUpload } = require('../utils/multer'); // multipart/form-data

const router = express.Router();

router.use(protectSession);

// Get all products
// Create new product
router
	.route('/')
	.get(getAllProducts)
	.post(
		multerUpload.fields([{ name: 'productImgs', maxCount: 3 }]),
		// multerUpload.single('productImg'),
		createProductValidations,
		validateResult,
		createProduct
	);

// Get produts listed by the user
router.get('/user-products', getUserProducts);

// Get products' categories
router
	.route('/categories')
	.get(getCategories)
	.post(createCategoryValidations, validateResult, createCategory);

// Get product's details
// Update product
// Remove product
router
	.use('/:id', productExists)
	.route('/:id')
	.get(getProductDetails)
	.patch(protectProductOwner, updateProduct)
	.delete(protectProductOwner, disableProduct);

module.exports = { productsRouter: router };

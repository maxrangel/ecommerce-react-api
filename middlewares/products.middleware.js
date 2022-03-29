// Models
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model');
const { ProductImg } = require('../models/productImg.model');
const { User } = require('../models/user.model');

// Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.productExists = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const product = await Product.findOne({
		where: { id, status: 'active' },
		include: [
			{ model: User, attributes: { exclude: ['password'] } },
			{ model: ProductImg, attributes: ['imgPath'] },
			{ model: Category },
		],
	});

	if (!product) {
		return next(new AppError('No product found', 404));
	}

	req.product = product;

	next();
});

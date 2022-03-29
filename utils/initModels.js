// Models
const { Cart } = require('../models/cart.model');
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model');
const { ProductImg } = require('../models/productImg.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Purchase } = require('../models/purchase.model');
const { User } = require('../models/user.model');

const initModels = () => {
	// 1 User <--> Product M
	User.hasMany(Product, { foreignKey: 'userId' });
	Product.belongsTo(User, { targetKey: 'id' });

	// 1 Product <--> Category 1
	Category.hasOne(Product);
	Product.belongsTo(Category);

	// 1 User <--> Cart 1
	User.hasOne(Cart);
	Cart.belongsTo(User);

	// 1 User <--> Order M
	User.hasMany(Purchase);
	Purchase.belongsTo(User);

	Cart.hasOne(Purchase);
	Purchase.belongsTo(Cart);

	// 1 Product <--> ProductImg M
	Product.hasMany(ProductImg);
	ProductImg.belongsTo(Product);

	// M Product <--> Cart M
	Product.belongsToMany(Cart, { through: ProductInCart });
	Cart.belongsToMany(Product, { through: ProductInCart });
};

module.exports = { initModels };

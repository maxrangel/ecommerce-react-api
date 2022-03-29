exports.formatProducts = products =>
	products.map(
		({
			id,
			title,
			description,
			price,
			status,
			user,
			productImgs,
			category: { name },
		}) => {
			return {
				id,
				title,
				description,
				category: name,
				price,
				status,
				user,
				productImgs: productImgs.map(({ imgPath }) => imgPath),
			};
		}
	);

exports.formatProduct = ({
	id,
	title,
	description,
	price,
	status,
	user,
	productImgs,
	category: { name },
}) => ({
	id,
	title,
	description,
	price,
	status,
	user,
	category: name,
	productImgs: productImgs.map(({ imgPath }) => imgPath),
});

exports.formatUserCart = ({ id, totalPrice, productsInCarts }) => {
	const formattedProducts = productsInCarts.map(
		({ product, id, price, quantity, productId }) => {
			const { name, description, category } = product;

			return { id, price, quantity, productId, name, description, category };
		}
	);

	return { id, totalPrice, products: formattedProducts };
};

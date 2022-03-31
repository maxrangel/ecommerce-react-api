const dotenv = require('dotenv');

// Utils
const { db } = require('./utils/database');
const { initModels } = require('./utils/initModels');

// Express app
const { app } = require('./app');

dotenv.config({ path: './config.env' });

// Model relations

db.authenticate()
	.then(() => console.log('Database authenticated'))
	.catch(err => console.log(err));

initModels();

db.sync({ force: true })
	.then(() => console.log('Database synced'))
	.catch(err => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`Ecommerce API running on port ${PORT}!!!!`);
});

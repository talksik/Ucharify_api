const db = require('../app/config/db.config.js');

//verify connection to db
db.sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});

//force: true will drop the table if it already exists
const drop_tables = true;
db.sequelize.sync({ force: drop_tables }).then(() => {
	console.log(`Drop and Resync with { force: ${drop_tables} }`);
});

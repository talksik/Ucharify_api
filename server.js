//require dependencies
const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	port = process.env.PORT,
	db = require('./app/config/db.config.js');

console.log(process.env.JAWSDB_MARIA_URL);

app.use(bodyParser.json());

//handle CORS errors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);

	if (req.method == 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
		return res.status(200).json({});
	}

	next();
});

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
const drop_tables = false;
db.sequelize.sync({ force: drop_tables }).then(() => {
	console.log(`Drop and Resync with { force: ${drop_tables} }`);
});

//main route for api; perhaps for api docs frontend
app.get('/', function(req, res, next) {
	res.send('Welcome to the Ucharify API');
});

//adding routes to Express app
app.use('/api/donors', require('./app/routes/donors.route.js'));
app.use('/api/auth', require('./app/routes/auth.route.js'));

//404 not found error handling on any other routes
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

//General error handler for anything
app.use((error, req, res, next) => {
	//can log the error internally
	// console.log(error);

	if (req.app.get('env') !== 'development' && req.app.get('env') !== 'test') {
		delete error.stack;
	}

	//status is set from other logic depending on the error itself
	res.status(error.status || 500);
	res.json({
		error: error.message
	});
});

// Create a Server
var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	//server is successful
	console.log(`App listening at port: ${port}`);
});

//require dependencies
const express = require('express'),
	app = express(),
	router = express.Router(),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 4200,
	db = require('./app/config/db.config.js');

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

// force: true will drop the table if it already exists
const drop_tables = false;
db.sequelize.sync({ force: drop_tables }).then(() => {
	console.log(`Drop and Resync with { force: ${drop_tables} }`);
});

//define a route, usually this would be a bunch of routes imported from another file
app.get('/', function(req, res, next) {
	res.send('Welcome to the Ucharify API');
});

//adding routes to Express app
app.use('/api/donors', require('./app/routes/donors.route.js'));
app.use('/api/auth', require('./app/routes/auth.route.js'));

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

// Create a Server
var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	//server is successful
	console.log(`App listening at port: ${port}`);
});

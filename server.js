//require dependencies
const express = require('express'),
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 4200,
    sequelize = require('./sequelize.js');

//define a route, usually this would be a bunch of routes imported from another file
router.get('/', function (req, res, next) {
    res.send('Welcome to the Ucharify API');
});

//add routes to express app
// routes(app);

//start Express server on defined port
app.listen(port);

//log to console to let us know it's working
console.log('Ucharify API server started on: ' + port);

// //verify connection to db
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

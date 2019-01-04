//require dependencies
const express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 4200,
    db = require('./app/config/db.config.js');

app.use(bodyParser.json())

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
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync with { force: true }');
  });


//define a route, usually this would be a bunch of routes imported from another file
router.get('/', function (req, res, next) {
    res.send('Welcome to the Ucharify API');
});

//adding routes to Express app
require('./app/route/donors.route.js')(app);

// Create a Server
var server = app.listen(port, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  //server is successful
  console.log("App listening at http://%s:%s", host, port)
})
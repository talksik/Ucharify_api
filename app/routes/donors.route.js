module.exports = function(app) {
 
    const donors = require('../controllers/donors.controller.js');
 
    // Create a new Donor
    app.post('/api/donors', donors.create);
 
    // Retrieve all Donor
    app.get('/api/donors', donors.findAll);
 
    // Retrieve a single Donor by Id
    app.get('/api/donors/:DonorId', donors.findById);

    // Delete a Donor with Id
    app.delete('/api/donors/:DonorId', donors.delete);
 
    // // Update a Donor with Id
    // app.put('/api/donors/:DonorId', donors.update);
}
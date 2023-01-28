const mongoose = require('mongoose');
const env = require('../environemnt');

const url = env.MONGO_URL;

mongoose.connect(url);

const db = mongoose.connection; // database instance

db.on('error', function() {
    console.log('Error in connecting to the database');
});

db.once('open', function() {
    console.log('Connected to the database');
});

module.exports = db;
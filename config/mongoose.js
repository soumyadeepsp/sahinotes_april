const mongoose = require('mongoose');

const url = "mongodb+srv://soumyadeepsp:CodingNinjas1@cluster0.sd6en9b.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(url);

const db = mongoose.connection; // database instance

db.on('error', function() {
    console.log('Error in connecting to the database');
});

db.once('open', function() {
    console.log('Connected to the database');
});

module.exports = db;
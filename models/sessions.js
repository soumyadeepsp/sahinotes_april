const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    expires: {type: Date, require: true}
}, {
    timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session
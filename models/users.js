const mongoose = require('mongoose');
const multer = require('multer');

const userSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    name: {type: String, require: true},
    mobileOtp: {type: String},
    mobile: {type: String},
    accessToken: {type: String, default: null},
    notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}]
}, {
    timestamps: true
});

// we need to tell multer 2 things -
// 1. where to store the file
// 2. what is the name of the stored file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'../uploads/notes');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' + Date.now());
    }
  });
  
  const upload = multer({ storage: storage });

const User = mongoose.model('User', userSchema);

module.exports = User
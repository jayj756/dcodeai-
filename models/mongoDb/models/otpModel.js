//Require Mongoose
var mongoose = require('mongoose');
var schema = mongoose.Schema;

let schemaModel = new schema({
    phoneNumber: {type: String,require:true},
    email:{type: String,require:true},
    otp : {type: String,require:true},
}, {timestamps: true});

module.exports = mongoose.model('otpModel', schemaModel);

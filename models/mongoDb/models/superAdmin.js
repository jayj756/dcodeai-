//Require Mongoose
var mongoose = require('mongoose');
var schema = mongoose.Schema;

let schemaModel = new schema({
    firstName: {type: String, default: "",require:true},
    lastName:{type: String, default: "",require:true},
    email : {type: String, default: "",require:true},
    phoneNumber : {type: String, default: ""},
    password : {type: String, default: "",require:true},
    roleType : {type: String, default: "",},
    isDeleted:{type: Boolean, default:false},
}, {timestamps: true});

module.exports = mongoose.model('superAdmin', schemaModel);

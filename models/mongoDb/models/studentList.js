//Require Mongoose
var mongoose = require('mongoose');
var schema = mongoose.Schema;

let schemaModel;
schemaModel = new schema({
    firstname: {type: String, require: true},
    lastName: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, default: "", require: true},
    classDetail: {type: {}, require: true},
    schoolDetail: {type: {}, require: true},
    phoneNumber: {type: String, require: true},
    photo: {type: String, default: ""},
    password: {type: String, require: true},
    aboutYou: {type: String, default: ""},
    gender: {type: String, enum: ["M", "F"]},
    type: {type: String, require: true, enum: ["school", "individual"]},
    isDeleted: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = mongoose.model('studentList', schemaModel);

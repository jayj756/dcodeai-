//Require Mongoose
var mongoose = require('mongoose');
var schema = mongoose.Schema;

let schemaModel = new schema({

    name: {type: String, default: "",require:true},
    mobileNo:{type: String, default: "",require:true},
    email : {type: String, default: "",require:true},
    dob : {type: Date, default: ""},
    password : {type: String, default: "",require:true},
    latlng : {type: String, default: ""},
    city : {type: String, default: ""},
    buisnessProfile : {type: String, default: ""},
    language : {type: String, default: "",},
    payment: {},
    profileImage:{type: String, default: ""},
    isDeleted:{type: Boolean, default:false},
    }, {timestamps: true});

module.exports = mongoose.model('usersProfile', schemaModel);

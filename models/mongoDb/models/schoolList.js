//Require Mongoose
var mongoose = require('mongoose');
var schema = mongoose.Schema;

let schemaModel = new schema({
    schoolName: {type: String, default: "",require:true},
    schoolEmail:{type: String, default: "",require:true},
    logo : {type: String, default: ""},
    classes : {type: []},
    phoneNumber : {type: String ,require:true},
    password : {type: String, default: "",require:true},
    roleType : {type: String, default: "School",require:true},
    isDeleted:{type: Boolean, default:false},
}, {timestamps: true});

module.exports = mongoose.model('schoolList', schemaModel);

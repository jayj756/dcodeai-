//Require Mongoose
var mongoose = require('mongoose');
var schema = mongoose.Schema;

let schemaModel = new schema({
    name: {type: String, default: "",require:true},
    email:{type: String, default: "",require:true},
    classDetail : {type: {},require:true},
    phoneNumber : {type: String ,require:true},
    photo:{type: String ,default:""},
    password : {type: String,require:true},
    isDeleted:{type: Boolean, default:false},
}, {timestamps: true});

module.exports = mongoose.model('studentList', schemaModel);

//Require Mongoose
var mongoose = require('mongoose');
var schema = mongoose.Schema;

let schemaModel = new schema({
    schoolInfo: {type: {},require:true},
    name:{type: String,require:true},
    email:{type: String,require:true},
    phoneNumber : {type: String ,require:true},
    password : {type: String,require:true},
    roleType : {type: [],require:true},
    isDeleted:{type: Boolean, default:false},
}, {timestamps: true});

module.exports = mongoose.model('teacherList', schemaModel);

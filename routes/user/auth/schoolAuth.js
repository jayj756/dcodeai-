var express = require('express');
var user = express.Router();

//controllers
const schoolloginController = require("../../../controllers/userControllers/auth/school/login");
///routes

user.post('/login', schoolloginController.login);
user.post('/create', schoolloginController.create);
user.post('/registrationFormSchool', schoolloginController.registrationFormSchool);


//responce
module.exports = user;
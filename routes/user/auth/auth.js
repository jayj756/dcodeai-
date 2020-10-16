var express = require('express');
var user = express.Router();

//controllers
const superloginController = require("../../../controllers/userControllers/auth/superAdmin/login");
///routes

user.post('/login', superloginController.login);
user.post('/create', superloginController.create);
user.post('/sendOtp', superloginController.sendOtp);
user.post('/checkOtp', superloginController.checkOtp);
user.post('/resetPassword', superloginController.resetPassword);

user.post('/registrationFormSuperAdmin', superloginController.registrationFormSuperAdmin);


//responce
module.exports = user;

var express = require('express');
var user = express.Router();

//controllers
const studentloginController = require("../../../controllers/userControllers/auth/school/schoolStudent/login");
///routes

user.post('/login', studentloginController.login);
user.post('/register', studentloginController.register);

user.post('/resetPassword', studentloginController.resetPassword);



//responce
module.exports = user;

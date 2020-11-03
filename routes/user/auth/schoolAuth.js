var express = require('express');
var user = express.Router();

//controllers
const schoolloginController = require("../../../controllers/userControllers/auth/school/login");
///routes

user.post('/login', schoolloginController.login);
user.post('/create', schoolloginController.create);
user.post('/schoolmanager', schoolloginController.schoolmanager);
user.post('/registrationFormSchool', schoolloginController.registrationFormSchool);


user.post('/schoolupdate', schoolloginController.schoolupdate);
user.post('/schoolDeactivate', schoolloginController.schoolDeactivate);
user.post('/schoolDelete', schoolloginController.schoolDelete);


//responce
module.exports = user;
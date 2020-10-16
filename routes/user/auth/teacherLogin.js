var express = require('express');
var user = express.Router();

//controllers
const teacherloginController = require("../../../controllers/userControllers/auth/school/teacher/login");
///routes

user.post('/login', teacherloginController.login);


//responce
module.exports = user;
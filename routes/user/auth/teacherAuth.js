var express = require('express');
var user = express.Router();

//controllers
const teacherloginController = require("../../../controllers/userControllers/auth/school/teacher/login");
///routes

user.post('/create', teacherloginController.create);
user.post('/registrationFormTeacher', teacherloginController.registrationFormTeacher);


//responce
module.exports = user;
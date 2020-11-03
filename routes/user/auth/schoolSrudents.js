var express = require('express');
var user = express.Router();

//controllers
const schoolStudents = require("../../../controllers/userControllers/auth/school/schoolStudent/schoolStudents");
///routes

user.post('/studentprofileUpdate', schoolStudents.studentprofileUpdate);
user.post('/schoolStudentManager', schoolStudents.schoolStudentManager);



//responce
module.exports = user;
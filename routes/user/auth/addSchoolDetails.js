var express = require('express');
var user = express.Router();

//controllers
const addDetailController = require("../../../controllers/userControllers/auth/school/AddDetailProfile");
///routes

user.post('/createClasses', addDetailController.createClasses);

user.post('/addStudent', addDetailController.addStudent);
user.post('/registrationFormStudent', addDetailController.registrationFormStudent);

//responce
module.exports = user;
var express = require('express');
var user = express.Router();

//controllers
const addDetailController = require("../../../controllers/userControllers/auth/school/schoolStudent/individualprofile");
///routes

user.post('/profileUpdate', addDetailController.profileUpdate);



//responce
module.exports = user;
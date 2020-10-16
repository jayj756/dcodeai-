var express = require('express');
var userMiddleware = require('../../middleware/user/auth/userMiddleware');
var userindex = express.Router();

///routes
var auth = require('../user/auth/auth');
var schoolAuth = require('../user/auth/schoolAuth');
var teacherLogin = require('../user/auth/teacherLogin');
var teacherAuth = require('../user/auth/teacherAuth');
var addSchoolDetails = require('../user/auth/addSchoolDetails');

///routes


//controllers

//userindex.use('/masters', userMiddleware,masters);


//without middleware
userindex.use('/',auth);
userindex.use('/school',schoolAuth);
userindex.use('/teacher',userMiddleware,teacherAuth);
userindex.use('/classes',userMiddleware,addSchoolDetails);
userindex.use('/teacherLogin',teacherLogin);

// userindex.use('/user',userMasterRoutes);

module.exports = userindex;



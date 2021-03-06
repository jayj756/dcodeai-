var express = require('express');
var userMiddleware = require('../../middleware/user/auth/userMiddleware');
var userindex = express.Router();

///routes
var auth = require('../user/auth/auth');
var schoolAuth = require('../user/auth/schoolAuth');
var teacherLogin = require('../user/auth/teacherLogin');
var teacherAuth = require('../user/auth/teacherAuth');
var addSchoolDetails = require('../user/auth/addSchoolDetails');
var studentLogin = require('../user/auth/studentLogin');
var individualProfile = require('../user/auth/individualProfile');
var schoolStudents = require('../user/auth/schoolSrudents');

///routes


//controllers

//userindex.use('/masters', userMiddleware,masters);


//without middleware
userindex.use('/',auth);
userindex.use('/school',schoolAuth);
userindex.use('/teacher',userMiddleware,teacherAuth);
userindex.use('/classes',userMiddleware,addSchoolDetails);
userindex.use('/profile',userMiddleware,individualProfile);
userindex.use('/teacherLogin',teacherLogin);
userindex.use('/studentLogin',studentLogin);
userindex.use('/schoolStudents',userMiddleware,schoolStudents);

// userindex.use('/user',userMasterRoutes);

module.exports = userindex;



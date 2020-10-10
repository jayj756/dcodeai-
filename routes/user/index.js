var express = require('express');
var userMiddleware = require('../../middleware/user/auth/userMiddleware');
var userindex = express.Router();

///routes
var auth = require('../user/auth/auth');

///routes


//controllers

//userindex.use('/masters', userMiddleware,masters);


//without middleware
userindex.use('/',auth);
// userindex.use('/user',userMasterRoutes);

module.exports = userindex;



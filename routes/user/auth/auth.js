var express = require('express');
var user = express.Router();

//controllers
const superloginController = require("../../../controllers/userControllers/auth/superAdmin/login");
///routes
/**
 * @swagger
 * /Admin Side:
 *  post:
 *    description: Use to Login
 *    responses:
 *      '200':
 *        description: A successful response
 */
user.post('/login', superloginController.login);
user.post('/create', superloginController.create);


/**
 * @swagger
 * /Admin Side:
 *  Post:
 *    description: Register
 *    responses:
 *      '200':
 *        description: A successful response
 */

//user.post('/login', loginController.login);


//responce
module.exports = user;

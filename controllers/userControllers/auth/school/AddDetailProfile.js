const bcrypt = require('bcrypt');
const models = require('../../../../models/mongoDb/models/mainmodel');
const errorRes = require('../../../commonControllers/response/errorRes');
const successRes = require('../../../commonControllers/response/successRes');
const jwtToken = require('../../../commonControllers/jwtToken.js');
var MongoClient = require('mongodb').MongoClient;
var envfile = require('../../../../static/envfile');
const validate = require('../../../../utility/validation/validate.js');
var passwordHash = require('password-hash');

module.exports = {
    addStudent:async function (req, res, next) {
        //

        let name   = req.body.name;
        let email   = req.body.email;
        let classDetail   = req.body.classDetail;
        let phoneNumber   = req.body.phoneNumber;
        let password   = req.body.password;

        await validate.nullOrBlankAll(res, req.body, "name","email","classDetail","phoneNumber","password");

        var hashedPassword = await passwordHash.generate(password);

        let requiredParam = 'phoneNumber'

        let oldRes = await models.mongo.studentList.findOne({$and:{phoneNumber: phoneNumber, name: name}}, requiredParam);

        console.log(oldRes)
        if (oldRes == null) {
            var data = await new models.mongo.studentList({
                name: name,
                email: email,
                classDetail: classDetail,
                phoneNumber: phoneNumber,
                password: hashedPassword,

            });
            data.save(function (err, results) {
                if (err) {
                    errorRes.errorCustomMessage(res, {mes: "Error", err: err})
                }
                successRes.Added(res);
            });
        } else {
            await errorRes.errorCustomMessage(res, {mes: "User Already Exist", err: {}})
        }


    },
    registrationFormStudent: async function (req, res, next) {

        let schema = {
            "name": {
                "type": "string",
                "title": "Full Name",
                "Validation": {
                    "textCount": "80",
                    "spaceAllowed": false,
                    "emailCheck": false,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA",//"large/Normal/Extra Large",
                "screen size": "Full",
                "placement": "left"
            },
            "email": {
                "type": "string",
                "title": "Email",
                "Validation": {
                    "textCount": "",
                    "spaceAllowed": false,
                    "emailCheck": true,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA",//"large/Normal/Extra Large",
                "screen size": "Full",
                "placement": "left"
            },
            "className": {
                "type": "string",
                "title": "Class Name",
                "Validation": {
                    "textCount": "",
                    "spaceAllowed": false,
                    "emailCheck": false,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA",//"large/Normal/Extra Large",
                "screen size": "Full",
                "placement": "left"
            },
            "section": {
                "type": "string",
                "title": "Section",
                "Validation": {
                    "textCount": "",
                    "spaceAllowed": false,
                    "emailCheck": false,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA",//"large/Normal/Extra Large",
                "screen size": "Full",
                "placement": "left"
            },
            "phoneNumber": {
                "type": "string",
                "title": "Phone Number",
                "Validation": {
                    "textCount": "10",
                    "spaceAllowed": false,
                    "emailCheck": false,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA",//"large/Normal/Extra Large",
                "screen size": "Full",
                "placement": "left"
            },
            "password": {
                "type": "string",
                "title": "Confirm Password",
                "Validation": {
                    "textCount": "",
                    "spaceAllowed": false,
                    "emailCheck": false,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA", //"large/Normal/Extra Large",
                "screen size": "Full",
                "placement": "left"
            },
            "confirmPassword": {
                "type": "string",
                "title": "Confirm Password",
                "Validation": {
                    "textCount": "",
                    "spaceAllowed": false,
                    "emailCheck": false,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA", //"large/Normal/Extra Large",
                "screen size": "Full",
                "placement": "left"
            },

        }
        await successRes.successCustomMessage(res, {mes: "Student Form Data", data2: schema});

    },
    createClasses: async function (req, res, next) {

        let className = req.body.className;
        let sections = req.body.sections;
        let phoneNumber = req.body.authUser.phoneNumber;


        await validate.nullOrBlankAll(res, req.body, "className");



        let requiredParam = 'classes'

        let oldRes = await models.mongo.schoolList.findOne({phoneNumber: phoneNumber}, requiredParam);

        console.log(oldRes)
        if (oldRes != null) {
            let x = {
                class:className,
                section:sections,
                addedBy:req.body.authUser.roleType
            }

            let classes = oldRes.classes
            let exist = 0
            for(var i = 0; i <classes.length;i++)
            {
                if(classes[i].class == className)
                {
                    exist = 1
                    break
                }
            }
            if(exist == 1)
            {
                errorRes.errorCustomMessage(res, {mes: "Class already Exist" });
            }
            else
            {
                classes.push(x)

                await models.mongo.schoolList.findOneAndUpdate({
                    phoneNumber: phoneNumber
                }, {$set: {classes: classes}}, function (err, user) {
                    if (err) {
                        errorRes.errorCustomMessage(res, {mes: "Issue in add class" + err});
                    }

                    successRes.successCustomMessage(res, {mes: "Class added", data: {}});

                });
            }

        } else {
            await errorRes.errorCustomMessage(res, {mes: "Invalid School Details", err: {}})

        }

    },

    }


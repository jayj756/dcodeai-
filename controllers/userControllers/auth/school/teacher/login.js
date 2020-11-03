const bcrypt = require('bcrypt');
const models = require('../../../../../models/mongoDb/models/mainmodel');
const errorRes = require('../../../../commonControllers/response/errorRes');
const successRes = require('../../../../commonControllers/response/successRes');
const jwtToken = require('../../../../commonControllers/jwtToken.js');
var MongoClient = require('mongodb').MongoClient;
var envfile = require('../../../../../static/envfile');
const validate = require('../../../../../utility/validation/validate.js');
var passwordHash = require('password-hash');
const constants = require('../../../../../static/constants');

module.exports = {
    registrationFormTeacher: async function (req, res, next) {

        let schema = {

            "name": {
                "type": "string",
                "title": "Teacher Name",
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
            "PhoneNumber": {
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
            "password": {
                "type": "string",
                "title": "Password",
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
            "roleType": {
                "type": "string",
                "title": "roleType",
                "enum":["admin","teacher"],
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
        await successRes.successCustomMessage(res, {mes: "Teacher Form Data", data2: schema});

    },
    create: async function (req, res, next) {


        //console.log(req.body)

        let name = req.body.name;
        let email = req.body.email;
        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;
        let roleType = req.body.roleType;

        let schoolInfo = JSON.parse(JSON.stringify(req.body.authUser))
        delete schoolInfo.logiinFor
        delete schoolInfo.loginTimestamp
        delete schoolInfo.source

        console.log(schoolInfo)


        let k = await validate.arrayCheck( roleType);
        if(k == 1)
        {
            await validate.nullOrBlankAll(res, req.body, "name","email","phoneNumber","password","roleType");



            var hashedPassword = await passwordHash.generate(password);

            let requiredParam = 'phoneNumber'

            let oldRes = await models.mongo.teacherList.findOne({ phoneNumber:phoneNumber },requiredParam);

            console.log(oldRes)
            if(oldRes == null)
            {
                var data = await new models.mongo.teacherList({
                    schoolInfo:schoolInfo,
                    name:name,
                    email:email,
                    phoneNumber:phoneNumber,
                    password:hashedPassword,
                    roleType:roleType,

                });
                data.save(function (err, results) {
                    console.log(results._id);
                    if (err) {
                        errorRes.errorCustomMessage(res, {mes: "Error", err: err})

                    }
                    successRes.Added(res);
                });
            }
            else
            {
                await errorRes.errorCustomMessage(res, {mes: "User Already Exist", err: {}})
            }
        }
        else
        {
            await errorRes.errorCustomMessage(res, {mes: "roleType Must be Array", err: {}})
        }


    },

    login: async function (req, res, next) {

        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;
        let source = req.body.source;


        await validate.nullOrBlankAll(res, req.body, "phoneNumber","password","source");



        let requiredParam = 'name email phoneNumber password roleType schoolInfo'


        if (await validate.nullOrBlankInternal(phoneNumber) == 1) {
            models.mongo.teacherList.findOne({ phoneNumber:phoneNumber },requiredParam,async function (err, doc){
                if (err) {
                    await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: err})
                } else {

                    if(passwordHash.verify(password, doc.password)  ) {

                        doc = JSON.parse(JSON.stringify(doc))
                        delete doc.password
                        var jwt = await jwtToken.createJwt({
                            authUser: doc,
                            source: source,
                            loginFor: "School",
                            timestamp: +new Date()
                        });

                        await successRes.provideAccessToken(res, {
                            data: doc,
                            jwtToken: jwt
                        });

                    }
                else
                    {
                        await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: {}})

                    }
                }

            })
        }

    },
    teachermanager: async function (req, res, next) {
        var searchObj = {};
        var serchObjOr = [];
        var serchObjAnd = [];

        ///limit Object
        var limitObj = {};
        var middleObj = null;


        var startpoint = req.body.start;
        var limit = req.body.limit;
        var search = req.body.search;
        if ("search" in req.body) {
            search = search.trim();
        }
        if (await validate.nullOrBlankInternal(startpoint) == 0) {
            startpoint = constants.managers.startPoint;
        }
        if (await validate.nullOrBlankInternal(limit) == 0) {
            limit = constants.managers.limit;
        }
        if ((await validate.nullOrBlankInternal(sortBy)) === 0) {
            sortBy = constants.managers.sortBy;
        }

        limitObj.limit = limit;
        limitObj.skip = startpoint;
        var sortBy = req.body.sortBy;
        searchObj.isDeleted = false;
        if (await validate.nullOrBlankInternal(search) != 0) {
            serchObjOr.push({name: {$regex: '.*' + search + '.*'}});
            serchObjOr.push({email: {$regex: '.*' + search + '.*'}});
            serchObjOr.push({phoneNumber: {$regex: '.*' + search + '.*'}});
            searchObj['$or'] = serchObjOr;
        }

        try {

            let count = await models.mongo.teacherList.find(searchObj).countDocuments();


            await models.mongo.teacherList.find(searchObj, middleObj, limitObj).sort(sortBy).exec(async function (err, data) {
                var responseObj = {};
                responseObj.data = data;
                responseObj.total = count;
                await successRes.successCustomMessage(res, {mes: "Data Found", data: responseObj});


            });
        } catch (e) {
            await errorRes.errorCustomMessage(res, {mes: e, err: {}})
        }

    },
    resetPassword: async function (req, res, next) {

        let pass = req.body.password;
        let phoneNumber = req.body.phoneNumber;


        models.mongo.teacherList.findOne({phoneNumber: phoneNumber}).then(
            async result => {
                if (result != null) {
                    var hashedPassword = await passwordHash.generate(pass);


                    await models.mongo.teacherList.findOneAndUpdate({
                        phoneNumber: phoneNumber
                    }, {$set: {password: hashedPassword}}, function (err, user) {
                        if (err) {
                            errorRes.errorCustomMessage(res, {mes: "Issue in Reset Password" + err});
                        }

                        successRes.successCustomMessage(res, {mes: "Reset Password Complete", data: {}});

                    });
                } else {
                    await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: {}})

                }


            }
        ).catch(err => {
            console.log(err);
        })


    },
    teacherupdate: async function (req, res, next) {
        let toUpdateId = req.body.toUpdateId;
        await validate.toUpdateIdCheck(res, toUpdateId);
        let name = req.body.name;
        let email = req.body.email;
        let phoneNumber = req.body.phoneNumber;
        let roleType = req.body.roleType;
        let schoolInfo = JSON.parse(JSON.stringify(req.body.authUser))
        delete schoolInfo.logiinFor
        delete schoolInfo.loginTimestamp
        delete schoolInfo.source


        await validate.nullOrBlankAll(res, req.body, 'name',
            'email', 'phoneNumber', 'roleType');


        try {
            models.mongo.teacherList.findOne({_id: toUpdateId}, async function (err, doc) {
                if (err) {
                    console.log("hereerr")

                    await errorRes.errorCustomMessage(res, {mes: err, err: {}})
                }
                if (doc != null) {
                    console.log("doc")

                    doc.name = name,
                        doc.email = email,
                        doc.phoneNumber = phoneNumber,
                        doc.roleType = roleType,
                        doc.schoolInfo = schoolInfo,
                    await doc.save(async function (err, results) {
                        if (err) {
                            await errorRes.errorCustomMessage(res, {mes: err, err: {}})
                        }
                        successRes.update(res);
                    });
                }
            });
            await successRes.update(res);
        } catch (e) {
            await errorRes.errorCustomMessage(res, {mes: e, err: {}})
        }
    },

    teacherDeactivate: async function (req, res, next) {
        var id = req.body.id;
        await validate.nullOrBlankAll(res, req.body, 'id');
        try {
            models.mongo.teacherList.findOne({_id: id}, async function (err, data) {
                if (err) {
                    await errorRes.errorCustomMessage(res, {mes: err, err: {}})
                }
                if (data != null) {
                    data.isDeleted = true,
                        await data.save(async function (err, results) {
                            if (err) {
                                await errorRes.errorCustomMessage(res, {mes: err, err: {}})
                            }
                            successRes.delete(res);
                        });
                } else {
                    await errorRes.errorCustomMessage(res, {mes: err, err: {}})
                }
            });
        } catch (e) {
            await errorRes.errorCustomMessage(res, {mes: e, err: {}})
        }
    },
    teacherDelete: async function (req, res, next) {
        var id = req.body.id;
        await validate.nullOrBlankAll(res, req.body, 'id');
        try {

                await models.mongo.teacherList.deleteOne({_id: id}).then(resk=>{


                        successRes.successCustomMessage(res, {mes: "Delete Successfully", data: {}});

                }).catch(err=>{

                    console.log(err);
                })
        } catch (e) {
            await errorRes.errorCustomMessage(res, {mes: e, err: {}})
        }
    },

};


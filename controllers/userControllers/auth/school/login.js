const bcrypt = require('bcrypt');
const models = require('../../../../models/mongoDb/models/mainmodel');
const errorRes = require('../../../commonControllers/response/errorRes');
const successRes = require('../../../commonControllers/response/successRes');
const jwtToken = require('../../../commonControllers/jwtToken.js');
var MongoClient = require('mongodb').MongoClient;
var envfile = require('../../../../static/envfile');
const validate = require('../../../../utility/validation/validate.js');
var passwordHash = require('password-hash');
const constants = require('../../../../static/constants');

module.exports = {
    registrationFormSchool: async function (req, res, next) {

        let schema = {
            "schoolName": {
                "type": "string",
                "title": "Name",
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
            "schoolEmail": {
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
            "logo": {
                "type": "string",
                "title": "School Logo",
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
            "schoolAddress": {
                "type": "string",
                "title": "School Address",
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
            "roleType": {
                "type": "string",
                "title": "roleType",
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
        await successRes.successCustomMessage(res, {mes: "School Form Data", data2: schema});

    },
    create: async function (req, res, next) {


        //console.log(req.body)

        let schoolName = req.body.schoolName;
        let schoolEmail = req.body.schoolEmail;
        let logo = req.body.logo;
        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;
        let roleType = req.body.roleType;

        await validate.nullOrBlankAll(res, req.body, "schoolName", "schoolEmail", "logo", "phoneNumber", "password", "roleType");


        var hashedPassword = await passwordHash.generate(password);

        let requiredParam = 'phoneNumber'

        let oldRes = await models.mongo.schoolList.findOne({phoneNumber: phoneNumber}, requiredParam);

        console.log(oldRes)
        if (oldRes == null) {
            var data = await new models.mongo.schoolList({
                schoolName: schoolName,
                schoolEmail: schoolEmail,
                logo: logo,
                classes:[],
                phoneNumber: phoneNumber,
                password: hashedPassword,
                roleType: roleType,

            });
            data.save(function (err, results) {
                console.log(results._id);
                if (err) {
                    errorRes.errorCustomMessage(res, {mes: "Error", err: err})

                }
                successRes.Added(res);
            });
        } else {
            await errorRes.errorCustomMessage(res, {mes: "User Already Exist", err: {}})
        }

    },

    login: async function (req, res, next) {

        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;
        let source = req.body.source;


        await validate.nullOrBlankAll(res, req.body, "phoneNumber", "password", "source");

        let requiredParam = 'schoolName schoolEmail logo phoneNumber password roleType'


        if (await validate.nullOrBlankInternal(phoneNumber) == 1) {
            models.mongo.schoolList.findOne({phoneNumber: phoneNumber}, requiredParam, async function (err, doc) {
                if (err) {
                    await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: err})
                } else {
                    if(doc == null)
                    {
                        await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: {}})
                    }
                    else
                    {
                        if (passwordHash.verify(password, doc.password)) {

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
                        } else {
                            await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: {}})

                        }

                        }
                }

            })
        }

    },
    schoolmanager: async function (req, res, next) {
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
            serchObjOr.push({schoolName: {$regex: '.*' + search + '.*'}});
            serchObjOr.push({schoolEmail: {$regex: '.*' + search + '.*'}});
            serchObjOr.push({phoneNumber: {$regex: '.*' + search + '.*'}});
            searchObj['$or'] = serchObjOr;
        }

        try {

            let count = await models.mongo.schoolList.find(searchObj).countDocuments();


            await models.mongo.schoolList.find(searchObj, middleObj, limitObj).sort(sortBy).exec(async function (err, data) {
                var responseObj = {};
                responseObj.data = data;
                responseObj.total = count;
                await successRes.successCustomMessage(res, {mes: "Data Found", data: responseObj});


            });
        } catch (e) {
            await errorRes.errorCustomMessage(res, {mes: e, err: {}})
        }

    },
    schoolupdate: async function (req, res, next) {
        let toUpdateId = req.body.toUpdateId;
        await validate.toUpdateIdCheck(res, toUpdateId);
        let schoolName = req.body.schoolName;
        let schoolEmail = req.body.schoolEmail;
        let logo = req.body.logo;
        let phoneNumber = req.body.phoneNumber;
        let roleType = req.body.roleType;

        await validate.nullOrBlankAll(res, req.body, "schoolName",
            "schoolEmail", "logo", "phoneNumber", "roleType");








        try {
            models.mongo.schoolList.findOne({_id: toUpdateId}, async function (err, doc) {
                if (err) {
                    console.log("hereerr")

                    await errorRes.errorCustomMessage(res, {mes: err, err: {}})
                }
                if (doc != null) {
                    console.log("doc")

                    doc.schoolName =schoolName,
                    doc.schoolEmail =schoolEmail,
                    doc.logo =logo,
                    doc.phoneNumber =phoneNumber,
                    doc.roleType =roleType,
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

    schoolDeactivate: async function (req, res, next) {
        var id = req.body.id;
        await validate.nullOrBlankAll(res, req.body, 'id');
        try {
            models.mongo.superAdmin.findOne({_id: id}, async function (err, data) {
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
    schoolDelete: async function (req, res, next) {
        var id = req.body.id;
        await validate.nullOrBlankAll(res, req.body, 'id');
        try {

            await models.mongo.superAdmin.deleteOne({_id: id}).then(resk=>{


                successRes.successCustomMessage(res, {mes: "Delete Successfully", data: {}});

            }).catch(err=>{

                console.log(err);
            })
        } catch (e) {
            await errorRes.errorCustomMessage(res, {mes: e, err: {}})
        }
    },
    resetPassword: async function (req, res, next) {

        let pass = req.body.password;
        let phoneNumber = req.body.phoneNumber;


        models.mongo.schoolList.findOne({phoneNumber: phoneNumber}).then(
            async result => {
                if (result != null) {
                    var hashedPassword = await passwordHash.generate(pass);


                    await models.mongo.schoolList.findOneAndUpdate({
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


    }
}


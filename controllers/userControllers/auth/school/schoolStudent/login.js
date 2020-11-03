const bcrypt = require('bcrypt');
const models = require('../../../../../models/mongoDb/models/mainmodel');
const errorRes = require('../../../../commonControllers/response/errorRes');
const successRes = require('../../../../commonControllers/response/successRes');
const jwtToken = require('../../../../commonControllers/jwtToken.js');
var MongoClient = require('mongodb').MongoClient;
var envfile = require('../../../../../static/envfile');
const validate = require('../../../../../utility/validation/validate.js');
var passwordHash = require('password-hash');

module.exports = {

    register: async function (req, res, next) {

        let firstname   = req.body.firstname;
        let lastName   = req.body.lastName;
        let email   = req.body.email;
        let classDetail   = req.body.classDetail;
        let schoolDetail   = req.body.schoolDetail;
        let phoneNumber   = req.body.phoneNumber;
        let photo   = req.body.photo;
        let password   = req.body.password;
        let source   = req.body.source;

        let name = firstname + " " + lastName

        await validate.nullOrBlankAll(res, req.body, "firstname", "lastName", "email",
             "phoneNumber","password","photo");

        let requiredParam = 'email phoneNumber'



        if (await validate.nullOrBlankInternal(phoneNumber) == 1) {
            var hashedPassword = await passwordHash.generate(password);

            models.mongo.studentList.findOne({$or:[{phoneNumber: phoneNumber},{email: email}]}, requiredParam, async function (err, doc) {
                if (err) {
                    await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: err})
                } else {
                    if(doc == null)
                    {
                        var data = await new models.mongo.studentList({
                            firstname:firstname,
                            lastName:lastName,
                            name: name,
                            email: email,
                            classDetail: classDetail,
                            schoolDetail: schoolDetail,
                            phoneNumber: phoneNumber,
                            password: hashedPassword,
                            type:"individual",
                            photo:photo,
                            aboutYou:""

                        });
                        data.save(async function (err, results) {
                            if (err) {
                                errorRes.errorCustomMessage(res, {mes: "Error", err: err})
                            }

                            results = JSON.parse(JSON.stringify(results))
                            delete results.password
                            var jwt = await jwtToken.createJwt({
                                authUser: doc,
                                source: source,
                                loginFor: "Indivitual",
                                timestamp: +new Date()
                            });

                            await successRes.provideAccessTokenAfterReg(res, {
                                data: results,
                                jwtToken: jwt
                            });
                        });
                    }
                    else
                    {
                        await errorRes.errorCustomMessage(res, {mes: "User Details Already Exist", err: {}})
                    }
                }

            })
        }

    },
        login: async function (req, res, next) {

        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;
        let source = req.body.source;


        await validate.nullOrBlankAll(res, req.body, "phoneNumber", "password", "source");




        if (await validate.nullOrBlankInternal(phoneNumber) == 1) {
            models.mongo.studentList.findOne({$or:[{phoneNumber: phoneNumber},{email: phoneNumber}]}, async function (err, doc) {
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
    resetPassword: async function (req, res, next) {

        let pass = req.body.password;
        let phoneNumber = req.body.phoneNumber;


        models.mongo.studentList.findOne({$or:[{phoneNumber: phoneNumber},{email: phoneNumber}]}).then(
            async result => {
                if (result != null) {
                    var hashedPassword = await passwordHash.generate(pass);


                    await models.mongo.studentList.findOneAndUpdate({
                        phoneNumber: result.phoneNumber
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


    studentDeactivate: async function (req, res, next) {
        var id = req.body.id;
        await validate.nullOrBlankAll(res, req.body, 'id');
        try {
            models.mongo.studentList.findOne({_id: id}, async function (err, data) {
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
    studentDelete: async function (req, res, next) {
        var id = req.body.id;
        await validate.nullOrBlankAll(res, req.body, 'id');
        try {

            await models.mongo.studentList.deleteOne({_id: id}).then(resk=>{


                successRes.successCustomMessage(res, {mes: "Delete Successfully", data: {}});

            }).catch(err=>{

                console.log(err);
            })
        } catch (e) {
            await errorRes.errorCustomMessage(res, {mes: e, err: {}})
        }
    },

}


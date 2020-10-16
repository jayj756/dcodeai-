const bcrypt = require('bcrypt');
const models = require('../../../../models/mongoDb/models/mainmodel');
const errorRes = require('../../../commonControllers/response/errorRes');
const successRes = require('../../../commonControllers/response/successRes');
const jwtToken = require('../../../commonControllers/jwtToken.js');
var MongoClient = require('mongodb').MongoClient;
var envfile = require('../../../../static/envfile');
const validate = require('../../../../utility/validation/validate.js');
var passwordHash = require('password-hash');
const https = require('https')

module.exports = {
    registrationFormSuperAdmin: async function (req, res, next) {


        let schema = {
            "First Name": {
                "type": "string",
                "title": "First Name",
                "Validation": {
                    "textCount": "30",
                    "spaceAllowed": false,
                    "emailCheck": false,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA",//"large/Normal/Extra Large",
                "screen size": "Half",
                "placement": "left"
            },
            "Last Name": {
                "type": "string",
                "title": "Last Name",
                "Validation": {
                    "textCount": "30",
                    "spaceAllowed": false,
                    "emailCheck": false,
                    "dateFormat": ""
                },
                "spaceFromPrevious": "NA",//"large/Normal/Extra Large",
                "screen size": "Half",
                "placement": "left"
            },
            "Email": {
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
            "Phone No": {
                "type": "string",
                "title": "Phone No",
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
            "Password": {
                "type": "string",
                "title": "Password",
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
            "Confirm Password": {
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
        await successRes.successCustomMessage(res, {mes: "Form Data", data2: schema});

    },
    create: async function (req, res, next) {


        console.log(req.body)

        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;
        let roleType = req.body.roleType;

        await validate.nullOrBlankAll(res, req.body, "firstName","lastName","email","phoneNumber","password");



        var hashedPassword = await passwordHash.generate(password);

        let requiredParam = 'phoneNumber'

        let oldRes = await models.mongo.superAdmin.findOne({ phoneNumber:phoneNumber },requiredParam);

        console.log(oldRes)
        if(oldRes == null)
        {
            var data = await new models.mongo.superAdmin({
                firstName:firstName,
                lastName:lastName,
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

    },

    login: async function (req, res, next) {

        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;
        let source = req.body.source;


        await validate.nullOrBlankAll(res, req.body, "phoneNumber","password","source");

        let requiredParam = 'firstName lastName email phoneNumber password roleType'


        if (await validate.nullOrBlankInternal(phoneNumber) == 1) {
            models.mongo.superAdmin.findOne({ phoneNumber:phoneNumber },requiredParam,async function (err, doc){
                if (err) {
                    await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: err})
                } else {
                    if(doc!=null)
                    {
                        if(passwordHash.verify(password, doc.password)  ) {

                            doc = JSON.parse(JSON.stringify(doc))
                            delete doc.password
                            var jwt = await jwtToken.createJwt({
                                authUser: doc,
                                source: source,
                                loginFor: "Super Admin",
                                timestamp: +new Date()
                            });

                            await successRes.provideAccessToken(res, {
                                data: doc,
                                jwtToken: jwt
                            });

                        }
                        else
                        {
                            await errorRes.errorCustomMessage(res, {mes: "Invalid Password", err: {}})
                        }
                    }
                    else
                    {
                        await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: {}})
                    }

                }

            })
        }

    },
    sendOtp: async function (req, res, next) {

        let phoneNumber = req.body.phoneNumber;
        let type = req.body.type;

        await validate.nullOrBlankAll(res, req.body, "phoneNumber","type");

        let exist = 0

        if(type == "superAdmin")
        {
             exist  = await models.mongo.superAdmin.find({phoneNumber:phoneNumber}).countDocuments();
        }
        else if(type == "school")
        {
            exist  = await models.mongo.schoolList.find({phoneNumber:phoneNumber}).countDocuments();

        }
        else if(type == "teacher")
        {
            exist  = await models.mongo.teacherList.find({phoneNumber:phoneNumber}).countDocuments();

        }
        else
        {
            await errorRes.errorCustomMessage(res, {mes: "Role Not Exist", err: {}})
        }

        console.log(exist)
        if(exist > 0)
        {
            let url = "https://2factor.in/API/V1/"+envfile.otpsend.key+"/SMS/"+phoneNumber+"/AUTOGEN";


            https.get(url, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    console.log("end"+JSON.stringify(data));
                    if(JSON.parse(data).Status == "Error")
                    {
                        let data1 =  {
                            "data":JSON.parse(data)

                        }
                        successRes.successErrorMessage(res, {mes: "Invaid",data:JSON.parse(data)});

                    }
                    else
                    {
                        successRes.successCustomMessage(res, {mes: "OTP Sent Successfully",data:JSON.parse(data)});
                    }

                });

            }).on("error", (err) => {
                 errorRes.errorCustomMessage(res, {mes: "Invali1d", err: err})

            });
        }
        else
        {
            errorRes.errorCustomMessage(res, {mes: "Phone No Not Exist", err: {}})
        }


    },
    checkOtp: async function (req, res, next) {

        let otp = req.body.otp;
        let sessionId =req.body.sessionId;
        await validate.nullOrBlankAll(res, req.body, "otp","sessionId");


        let url = "https://2factor.in/API/V1/"+envfile.otpsend.key+"/SMS/VERIFY/"+sessionId+"/"+otp;


        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log("end"+JSON.stringify(data));
                successRes.successCustomMessage(res, {mes: "OTP Match Result",data:JSON.parse(data)});

            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    },
    resetPassword: async function (req, res, next) {

        let pass = req.body.password;
        let  phoneNumber = req.body.phoneNumber;


        models.mongo.superAdmin.findOne({phoneNumber:phoneNumber}).then(
            async result=>{
                if(result!=null)
                {
                    var hashedPassword = await passwordHash.generate(pass);


                    await models.mongo.superAdmin.findOneAndUpdate({phoneNumber:phoneNumber
                    }, {$set: {password: hashedPassword}}, function (err, user) {
                        if (err) {
                            errorRes.errorCustomMessage(res, {mes: "Issue in Reset Password" + err});
                        }

                        successRes.successCustomMessage(res, {mes: "Reset Password Complete", data: {}});

                    });
                }
                else
                {
                    await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: {}})

                }



            }
        ).catch(err=>{
            console.log(err);
        })



    },
    changeSinglePassword: async function (req, res, next) {

        let pass = req.body.pass;


        let  email = req.body.email;
        console.log(pass);
        console.log(email);

        models.mongo.adminMaster.findOne({email:email}).then(
            async result=>{
                console.log(result);

                var hashedPassword = await passwordHash.generate(pass);


                await models.mongo.adminMaster.findOneAndUpdate({email:email
                }, {$set: {password: hashedPassword}}, function (err, user) {
                    if (err) {
                        errorRes.errorCustomMessage(res, {mes: "Issue in Booking Rejection" + err});
                    }
                    console.log(user._id)

                    successRes.successCustomMessage(res, {mes: "Uploaded", data: user});

                });

            }
        ).catch(err=>{
            console.log(err);
        })



    },

};


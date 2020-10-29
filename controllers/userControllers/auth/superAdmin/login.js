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


        let otp = Math.floor(100000 + Math.random() * 900000)

        let phoneNumber = req.body.phoneNumber;
        let type = req.body.type;

        await validate.nullOrBlankAll(res, req.body, "phoneNumber","type");

        let exist = null

        if(type == "superAdmin")
        {
            exist  = await models.mongo.superAdmin.findOne({phoneNumber:phoneNumber})
        }
        else if(type == "school")
        {
            exist = await models.mongo.schoolList.findOne({phoneNumber:phoneNumber})

        }
        else if(type == "teacher")
        {
            exist = await models.mongo.teacherList.findOne({phoneNumber:phoneNumber})
        }
        else if(type == "student")
        {
            exist = await models.mongo.studentList.findOne({$or:[{phoneNumber:phoneNumber},{email:phoneNumber}]})
        }
        else
        {
            await errorRes.errorCustomMessage(res, {mes: "Role Not Exist", err: {}})
        }


        console.log(exist.email)
        console.log(exist.phoneNumber)

        if(exist != null)
        {

            var data = await new models.mongo.otpModel({
                phoneNumber:exist.phoneNumber,
                email:exist.email,
                otp:otp
            });
            await data.save(function (err, results) {
                console.log(results._id);
                if (err) {
                    errorRes.errorCustomMessage(res, {mes: "Error", err: err})
                }
            });

            sendMail(exist.email,otp)

            let url = "https://2factor.in/API/V1/"+envfile.otpsend.key+"/SMS/+91"+exist.phoneNumber+"/"+otp+"/dcodeAI";


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
        let phoneNumber =req.body.phoneNumber;
        await validate.nullOrBlankAll(res, req.body, "otp","phoneNumber");


        models.mongo.otpModel.findOne({$and:[{$or:[{phoneNumber:phoneNumber},{email:phoneNumber}]},{otp:otp}]}).lean().then(result=>{
            if(result != null)
        {
            successRes.successCustomMessage(res, {mes: "OTP Verified Successfully",data: {}});
        }
            else
            {
                errorRes.errorCustomMessage(res, {mes: "Invalid OTP" + err});
            }
        }).catch(err=>{
            errorRes.errorCustomMessage(res, {mes: "Issue in Verified Password" + err});
        })

        // let url = "https://2factor.in/API/V1/"+envfile.otpsend.key+"/SMS/VERIFY/"+sessionId+"/"+otp;


        // https.get(url, (resp) => {
        //     let data = '';

        //
        //     // A chunk of data has been recieved.
        //     resp.on('data', (chunk) => {
        //         data += chunk;
        //     });
        //
        //     // The whole response has been received. Print out the result.
        //     resp.on('end', () => {
        //         console.log("end"+JSON.stringify(data));
        //         successRes.successCustomMessage(res, {mes: "OTP Match Result",data:JSON.parse(data)});
        //
        //     });
        //
        // }).on("error", (err) => {
        //     console.log("Error: " + err.message);
        // });
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
    // sendMail: async function (to,OTP) {
    //
    //         let mailMessage = {};
    //         mailMessage.subject = "OTP";
    //         mailMessage.to = "rohit.mahajan@dcodeai.com";
    //         let queryHtmlBodyString = {}
    //         mailMessage.html = ""
    //         mailMessage.text = "1234"
    //         mailMessage.from = "info@dcodeai.com";
    //         await models.mailer.sendMail(mailMessage, async function (err, info) {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 console.log(info);
    //             }
    //         });
    //     }


};
    function sendMail (to,OTP) {

    let mailMessage = {};
    mailMessage.subject = "OTP";
    mailMessage.to = to;
    let queryHtmlBodyString = {}
    mailMessage.html = ""
    mailMessage.text = String(OTP)
    mailMessage.from = "info@dcodeai.com";
    models.mailer.sendMail(mailMessage, async function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}


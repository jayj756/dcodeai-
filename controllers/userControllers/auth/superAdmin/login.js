const bcrypt = require('bcrypt');
const models = require('../../../models/mongoDb/models/mainmodel');
const errorRes = require('../../../controllers/commonControllers/response/errorRes');
const successRes = require('../../../controllers/commonControllers/response/successRes');
const jwtToken = require('../../../controllers/commonControllers/jwtToken.js');
var MongoClient = require('mongodb').MongoClient;
var envfile = require('../../../static/envfile');
const validate = require('../../../utility/validation/validate.js');
var passwordHash = require('password-hash');

module.exports = {
    create: async function (req, res, next) {



        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let phoneNumber = req.body.phoneNumber;
        let password = req.body.password;
        let roleType = req.body.roleType;


        var data = await new models.mongo.superAdmin({
            firstName:firstName,
            lastName:lastName,
            email:email,
            phoneNumber:phoneNumber,
            password:password,
            roleType:roleType,

        });
        data.save(function (err, results) {
            console.log(results._id);
            if (err) {
                bugs.createBugAutoRevert(res, req, err);

            }
            successRes.Added(res);
        });
    },

    login: async function (req, res, next) {
        let mobileNo = req.body.mobileNo;

        console.log(mobileNo)



        if (await validate.nullOrBlankInternal(mobileNo) == 1) {
            models.mongo.usersProfile.findOne({ mobileNo:mobileNo },async function (err, doc){
                 if (err) {
                        await errorRes.errorCustomMessage(res, {mes: "Invalid User Details", err: err})
                    } else {
                     await successRes.successCustomMessage(res,{mes:"user Found",data:doc});
                    }

                })
        }

    },
    sendOtp: async function (req, res, next) {

        let mobileNo = req.body.mobileNo;
        await validate.nullOrBlankAll(res, req.body, "mobileNo");


        let url = "https://2factor.in/API/V1/"+envfile.otpsend.key+"/SMS/"+mobileNo+"/AUTOGEN";


        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log("end"+JSON.stringify(data));
                successRes.successCustomMessage(res, {mes: "OTP Sent Successfully",data:JSON.parse(data)});

            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });

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


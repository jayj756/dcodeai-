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


    profileUpdate: async function (req, res, next) {

        let firstname = req.body.firstname;
        let lastName = req.body.lastName;
        let name = req.body.name;
        let classDetail = req.body.classDetail;
        let schoolDetail = req.body.schoolDetail;
        let phoneNumber = req.body.phoneNumber;
        let photo = req.body.photo;
        let aboutYou = req.body.aboutYou;
        let gender = req.body.gender;


        models.mongo.studentList.findOne({phoneNumber: phoneNumber}).then(
            async result => {
                if (result != null) {


                    await models.mongo.studentList.findOneAndUpdate({
                        phoneNumber: phoneNumber
                    }, {$set: {firstname: firstname,lastName:lastName,name:name,
                            classDetail:classDetail,schoolDetail:schoolDetail,photo:photo,aboutYou:aboutYou,gender:gender}}, function (err, user) {
                        if (err) {
                            errorRes.errorCustomMessage(res, {mes: "Issue in Update Profile" + err});
                        }

                        successRes.successCustomMessage(res, {mes: "Update Complete", data: {}});

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


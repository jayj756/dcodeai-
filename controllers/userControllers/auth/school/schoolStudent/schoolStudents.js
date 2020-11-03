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

    schoolStudentManager: async function (req, res, next) {
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
        searchObj["schoolDetail._id"] = req.body.authUser._id
        if (await validate.nullOrBlankInternal(search) != 0) {
            serchObjOr.push({firstName: {$regex: '.*' + search + '.*'}});
            serchObjOr.push({email: {$regex: '.*' + search + '.*'}});
            serchObjOr.push({phoneNumber: {$regex: '.*' + search + '.*'}});
            searchObj['$or'] = serchObjOr;
        }

        try {

            let count = await models.mongo.studentList.find(searchObj).countDocuments();


            await models.mongo.studentList.find(searchObj, middleObj, limitObj).sort(sortBy).exec(async function (err, data) {
                var responseObj = {};
                responseObj.data = data;
                responseObj.total = count;
                await successRes.successCustomMessage(res, {mes: "Data Found", data: responseObj});


            });
        } catch (e) {
            await errorRes.errorCustomMessage(res, {mes: e, err: {}})
        }

    },
    studentprofileUpdate: async function (req, res, next) {


        let toUpdateId = req.body.toUpdateId;
        await validate.toUpdateIdCheck(res, toUpdateId);
        let firstname = req.body.firstname;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let classDetail = req.body.classDetail;
        let phoneNumber = req.body.phoneNumber;
        let photo = req.body.photo;
        let password = req.body.password;
        let aboutYou = req.body.aboutYou;
        let gender = req.body.gender;

        var hashedPassword = await passwordHash.generate(password);

        let name =  firstname + lastName
        if(aboutYou == null)
        {
            aboutYou = ""
        }
        try {
            models.mongo.studentList.findOne({_id: toUpdateId}, async function (err, doc) {
                if (err) {
                    console.log("hereerr")

                    await errorRes.errorCustomMessage(res, {mes: err, err: {}})
                }
                if (doc != null) {
                    console.log("doc")

                    doc.firstname = firstname,
                        doc.lastName = lastName,
                        doc.name = name,
                        doc.email = email,
                        doc.classDetail = classDetail,
                        doc.phoneNumber = phoneNumber,
                        doc.photo = photo,
                        doc.aboutYou = aboutYou,
                        doc.gender = gender,
                        doc.password = hashedPassword,
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


    }
}


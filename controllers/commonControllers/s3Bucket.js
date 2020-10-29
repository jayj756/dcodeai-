const express = require('express');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const envfile = require('../../static/envfile');
const constants = require('../../static/constants');
const validate = require('../../utility/validation/validate');
const model = require('../../models/mongoDb/models/mainmodel');
const errorRes = require('../commonControllers/response/errorRes');
const successRes = require('../commonControllers/response/successRes');


const s3 = new aws.S3({
    accessKeyId: envfile.aws.awsS3BucketId,
    secretAccessKey: envfile.aws.awsS3BucketSecret,
    Bucket: envfile.aws.awsS3BucketName,
    sslEnabled: true,

});

const  profileImgUpload =  multer({
    storage: multerS3({
        s3: s3,
        bucket: envfile.aws.awsS3BucketName,
        acl: 'public-read',
        sslEnabled: false,
        key: function (req, file, cb) {
            cb(null, "s3Bucket"+"oo"+String(Math.random()) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: {fileSize: 2000000}, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function (req, file, cb) {
        //checkFileType(file, cb);
        return cb( null, true );
    }
}).single('awsFileUpload');

const  profileImgUploadMultiple =  multer({
    storage: multerS3({
        s3: s3,
        bucket: envfile.aws.awsS3BucketName,
        acl: 'public-read',
        sslEnabled: true,

        key: function (req, file, cb) {
            cb(null, "s3Bucket"+"oo"+String(Math.random()) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: {fileSize: 2000000}, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function (req, file, cb) {
        //checkFileType(file, cb);
        return cb( null, true );
    }
}).single('fileUpload');

function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if( mimetype && extname ){
        return cb( null, true );
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = {
    uploadFileAWS: async function (req, res) {
        profileImgUpload ( req, res, async ( error ) =>  {
            if( error ){
                await errorRes.errorCustomMessage(res, {mes: error});
            } else {
                // If File not found
                if( req.file === undefined ){
                    await errorRes.errorCustomMessage(res, {mes: "No file selected"});
                } else {
                    // If Success
                    const imageName = req.file.key;
                    const imageLocation = req.file.location;

                    try{
                        var fileup=await model.write.files.create({url:imageLocation});
                        successRes.successCustomMessage(res,{mes:"",data:[{url:imageLocation}]})
                        return {success:"true",id:fileup.id};
                    }catch(e){
                        successRes.successCustomMessage(res,{mes:"",data:[{url:imageLocation}]})
                        return {success:"false",id:0,error:e};
                    }
                }
            }
        });
    },
    uploadFileAWSMultiple: async function (req, res) {
        let files=req.body.awsFileUpload

        let response=[];
        for (let i = 0; i <files.length ; i++) {
            req.body.fileUpload=files[i]
            profileImgUploadMultiple ( req, res, async ( error ) =>  {
                if( error ){
                    console.log("No file selected")
                } else {
                    // If File not found
                    if( req.file === undefined ){
                        console.log("No file selected")
                        //await errorRes.errorCustomMessage(res, {mes: "No file selected"});
                    } else {
                        // If Success
                        const imageName = req.file.key;
                        const imageLocation = req.file.location;
                        try{
                            model.write.files.create({url:imageLocation});
                            response.push({url:imageLocation})
                        }catch(e){
                            response.push({url:imageLocation})
                        }
                    }
                }
            });
        }
        successRes.successCustomMessage(res,{mes:"",data:response})
    },

    uploadFileInternal: async function (bufferData,fileType,filename) {
        if(filename==undefined){
            filename=constants.generatedFilesPrefix.default+"-"+String(Math.random()) + '-' + Date.now()+fileType;
        }
        let response={};
        const params = {
            Bucket: envfile.aws.awsS3BucketName,
            Key: filename,
            Body: bufferData,
            ACL: 'public-read'
        };
console.log("Parameters-->",params);
        let upProm=s3.upload(params);

        upProm=upProm.promise();


        await upProm.then(
             data=>{
                    //console.log(JSON.stringify(data))
                    response.data=data
                    response.success=true
            }
        ).catch(
            err=>{
                console.log(err)
                    response.data={}
                    response.success=false
            }
        );
         /*await s3.upload(params,  async function(err, data) {
            if(err){
                response.data={}
                response.success=false
            }else{
                console.log(JSON.stringify(data))
                response.data=data
                response.success=true
            }
        });*/
        return response;
    },
};



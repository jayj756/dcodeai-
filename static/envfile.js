
var return_var={
    "jwtSecretKey":"oneMoreStepTowardsMakingTheDifference"
}
var dbConnection={

    "readDbCompany":"dcodeAI",
    "writeDbCompany":"dcodeAI"
}

// var MongoDbConnection={
//
//
//     "url":"mongodb://localhost:27017/dcodeAI",
//
//     "user":"rohit",
//     "pass":"dcode123",
//
// }

var MongoDbConnection={


    // "url":"mongodb://localhost:27017/dcodeAI",
    "url":"mongodb://35.154.102.141:27017/dcodeAI",
    // "user":"",
    // "pass":"",

    "user":"rohit",
    "pass":"dcode123",

}

var nodeMailerBackup={
    "host": 'smtp3.netcore.co.in',
    "port": 465,
    "secure": true,
    "auth": {
        "user": '',
        "pass": ''
    },
    "tls": {
        "rejectUnauthorized": false
    }
}


var nodeMailer={
    "host": 'smtp.gmail.com',
    "port": 587,
    "secure": false,
    "auth": {
        "user": 'admin@dcodeai.com',
        "pass": '2UV8ai*vMr#q4L'
    },
    "tls": {
        "rejectUnauthorized": false
    }
}


var jwtSecretKey = "my-32-character-ultra-secure-and-ultra-long-secret"



var awsCred={
    "awsS3BucketId":"AKIATZ3NAWXURGRBATXQ",
    "awsS3BucketSecret":"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",
    "awsS3BucketName":"decodeai",
    "awsGeneratedFilesStartingLink":"https://decodeai.s3.amazonaws.com/"
}

var otpApiKey= {
    "key": "4e252372-0a1b-11eb-9fa5-0200cd936042"
}
module.exports.env        = return_var;
module.exports.aws        = awsCred;
module.exports.db         = dbConnection;
module.exports.mongo      = MongoDbConnection;
module.exports.nodeMailer = nodeMailer;
module.exports.otpsend = otpApiKey;
module.exports.jwtSecretKey = jwtSecretKey;

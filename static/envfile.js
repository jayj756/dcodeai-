

var dbConnection={

    "readDbCompany":"dcodeAI",
    "writeDbCompany":"dcodeAI"
}

var MongoDbConnection={


    "url":"mongodb://localhost:27017",

    "user":"",
    "pass":"",

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
    "host": 'smtpcorp.netcore.co.in',
    "port": 587,
    "secure": false,
    "auth": {
        "user": 'smtp_auth@logycode.com',
        "pass": '@My$a021a&'
    },
    "tls": {
        "rejectUnauthorized": false
    }
}





var awsCred={
    "awsS3BucketId":"AKIATZ3NAWXURGRBATXQ",
    "awsS3BucketSecret":"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",
    "awsS3BucketName":"----",
    "awsGeneratedFilesStartingLink":"https://logycodetest.s3.amazonaws.com/"
}

var otpApiKey= {
    "key": "148322ec-473a-11ea-9fa5-0200cd936042"
}

module.exports.aws        = awsCred;
module.exports.db         = dbConnection;
module.exports.mongo      = MongoDbConnection;
module.exports.nodeMailer = nodeMailer;
module.exports.otpsend = otpApiKey;

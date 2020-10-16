let envfile = require('../../../../backend/static/envfile');

//mongoDb
/*let MongoClient = require('mongodb').MongoClient;
MongoClient.connect(envfile.mongo.url, function(err, db) {
    if (err) throw err;
    //module.exports.mongoDb=db.db("logyNode");
});*/

//mongoose
let mongoose = require('mongoose');//.set('debug', true);

let options = {
    user: envfile.mongo.user,
    pass: envfile.mongo.pass,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 100,


};
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(envfile.mongo.url,options);

let schemas = ['superAdmin',
    'schoolList',
    'teacherList'
];
let mongoDb={};
for (const schema of schemas) {
    mongoDb[schema] = require('../../mongoDb/models/' + schema);


}
module.exports.mongo=mongoDb;


const nodemailer = require('nodemailer');
let transportMailer = nodemailer.createTransport(envfile.nodeMailer);
module.exports.mailer=transportMailer;







// let mongoose1 = require('mongoose');
//
// let options = {
//     user: envfile.mongo.user,
//     pass: envfile.mongo.pass,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// };
//
// mongoose1.connect(envfile.mongo.url,options);




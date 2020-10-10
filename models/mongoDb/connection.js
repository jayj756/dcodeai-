//Import the mongoose module
var mongoose = require('mongoose');
var envfile = require('../../static/envfile');

mongoose.connect(envfile.mongo.url,{ useNewUrlParser: true ,useUnifiedTopology:true});
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var SchemaD = mongoose.Schema;
var schemas = [
    'bankMaster'
];

module.exports = {
    con: async function (req, res, next) {
        var mongoDb={};
        for (const schema of schemas) {
            var format=await require('../mongoDb/models/'+schema+'.js');
            mongoDb[schema]= await mongoose.model(schema, new SchemaD(format));
        }
        return mongoDb;
    }
};




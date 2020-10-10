const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const envfile = require('../../../../backendNode/static/envfile.js');
module.exports = {
    insufficientDetail: async function (res) {
        res.status(400).send({
            'success': false,
            'message': 'Insufficient values',
            'result': [],
        })
        //throw new Error("Bad Request");
    },
    invalidDetail: async function (res) {
        res.status(400).send({
            'success': false,
            'message': 'Invalid Details.',
            'result': [],
        })
        //throw new Error("Bad Request");
    },
    errorCustomMessage: async function (res, obj) {
        res.status(400).send({
            'success': false,
            'message': obj.mes,
            'result': obj.data,
        })
        //return;
        // throw new Error("Bad Request");
    },
    errorGeneralMessage: async function (res) {
        res.status(400).send({
            'success': false,
            'message': "Something Went Wrong",
            'result': [],
        })
        //return
        // throw new Error("Bad Request");
    },
    errorIdNotFound: async function (res) {
        res.status(400).send({
            'success': false,
            'message': "Inappropriate Request.",
            'result': [],
        })
        //throw new Error("Bad Request");
    }
};

async function checkModule(req){
    let module="AIR"
    let urlTerms=req.originalUrl.split("/");
    if(await urlTerms.includes("ocean")){
        module="OCEAN"
    }
    return module;
}


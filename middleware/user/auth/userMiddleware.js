let jwt = require('jsonwebtoken');
const envfile = require('../../../static/envfile');

const userMiddleware = function tokenValidator(req, res, next) {
    //console.log(req.headers['x-access-token']);
    jwt.verify(req.headers['x-access-token'], envfile.env.jwtSecretKey, function (err, decoded) {
        if (err) {
            console.log(err)
            res.status(440).json({success: false, message: err.message, result: []});
            return
            //res.status(440).json({success: false, message: "", result: []});
        } else {
            // add user id to request
            //if (decoded.logiinFor == "user") {
                let obj=decoded.authUser;
                obj.CompanyCode=decoded.companycode;
                obj.loginTimestamp=decoded.timestamp;
                obj.source=decoded.source;
                obj.logiinFor=decoded.logiinFor;
                req.body.authUser= obj;
                next();
           /* } else {
                res.status(440).json({success: false, message: err.message, result: []});
            }*/
        }

    });
}
module.exports = userMiddleware;

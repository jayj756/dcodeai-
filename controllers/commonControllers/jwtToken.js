const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const envfile = require('../../../backend/static/envfile.js');
module.exports = {

    createJwt: async function (obj) {
        let expiresIn = '720h'
        if(obj.source== "web")
        {
            expiresIn = '24h'// expires in 24 hours
        }
        return  jwt.sign(obj,
            envfile.env.jwtSecretKey,
            {
                expiresIn: expiresIn
            }
         );
       }


};


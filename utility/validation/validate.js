const errorRes = require('../../controllers/commonControllers/response/errorRes');
const  stringOperations= require('../../utility/stringOperations/string.js');
const  constants= require('../../static/constants');
const  models= require('../../models/mongoDb/models/mainmodel');

// const  models= require('../../models/company/mainmodel');
let envfile = require('../../static/envfile.js');

module.exports = {

    nullOrBlankAll: async function (res, reqBody, ...parametersToBeChecked) {
        try{
            for (let i = 0; i < parametersToBeChecked.length; i++) {
                if (reqBody[parametersToBeChecked[i]] == '' || reqBody[parametersToBeChecked[i]] == null) {
                    var errorField=await stringOperations.camalizeAndSpaceOnCapitalChar(parametersToBeChecked[i]);
                    await errorRes.errorCustomMessage(res, {mes: "Please Enter Valid "+errorField });
                    throw new Error("Bad Request");
                }
            }
        }catch{
console.log("Here");
        }
    },
    toUpdateIdCheck: async function (res,idToBeUpdated) {
        if(idToBeUpdated=="" || idToBeUpdated==null){
            return await errorRes.errorIdNotFound(res);
            throw new Error("Bad Request");
        }
        return true;
    },
    nullOrBlankInternal: async function (value) {
        if (value == "" || value == null) {
            return 0
        } else {
            return 1;
        }
    },
    check3charonly: async function (res, reqBody, ...parametersToBeChecked) {
        for (let i = 0; i < parametersToBeChecked.length; i++) {
            if (reqBody[parametersToBeChecked[i]].length!=3) {
                var errorField=await stringOperations.camalizeAndSpaceOnCapitalChar(parametersToBeChecked[i]);
                await errorRes.errorCustomMessage(res, {mes: "Please Enter 3 digit " + errorField +" only"});
                throw new Error("Bad Request");
            }
        }
        return true;
    },
    check7charonly: async function (res, reqBody, ...parametersToBeChecked) {
        for (let i = 0; i < parametersToBeChecked.length; i++) {
            if (reqBody[parametersToBeChecked[i]].length!=7) {
                var errorField=await stringOperations.camalizeAndSpaceOnCapitalChar(parametersToBeChecked[i]);
                await errorRes.errorCustomMessage(res, {mes: "Please Enter 7 digit " + errorField +" only"});
                throw new Error("Bad Request");
            }
        }
        return true;
    },
    check2charonly: async function (res, reqBody, ...parametersToBeChecked) {
        for (let i = 0; i < parametersToBeChecked.length; i++) {
            if (reqBody[parametersToBeChecked[i]].length!=2) {
                var errorField=await stringOperations.camalizeAndSpaceOnCapitalChar(parametersToBeChecked[i]);
                await errorRes.errorCustomMessage(res, {mes: "Please Enter 2 digit " + errorField +" only"});
                throw new Error("Bad Request");
            }
        }
        return true;
    },

    check6charonly: async function (res, reqBody, ...parametersToBeChecked) {
        for (let i = 0; i < parametersToBeChecked.length; i++) {
            if (reqBody[parametersToBeChecked[i]].length!=6) {
                var errorField=await stringOperations.camalizeAndSpaceOnCapitalChar(parametersToBeChecked[i]);
                await errorRes.errorCustomMessage(res, {mes: "Please Enter 6 digit " + errorField +" only"});
                throw new Error("Bad Request");
            }
        }
        return true;
    },

    check10charonly: async function (res, reqBody, ...parametersToBeChecked) {
        for (let i = 0; i < parametersToBeChecked.length; i++) {
            if (reqBody[parametersToBeChecked[i]].length!=constants.validations.phoneNo) {
                var errorField=await stringOperations.camalizeAndSpaceOnCapitalChar(parametersToBeChecked[i]);
                await errorRes.errorCustomMessage(res, {mes: "Please Enter 10 digit " + errorField +" only"});
                throw new Error("Bad Request");
            }
        }
        return true;
    },

    arrayCheck: async function (value) {
        if (Array.isArray(value)) {
            return 1;
        } else {
            return 0;
        }
    },

    arraysToCheckArrayFormat: async function (res,reqBody,...arraysToCheckArrayFormat) {
        for (let i = 0; i < arraysToCheckArrayFormat.length; i++) {
            if (Array.isArray(reqBody[arraysToCheckArrayFormat[i]])){
            } else {
                var errorfield= await stringOperations.camalizeAndSpaceOnCapitalChar(arraysToCheckArrayFormat[i]);
                await errorRes.errorCustomMessage(res, {mes:errorfield +" Must Be An Array"});
                throw new Error("Bad Request");
            }
        }
        return true;
    },

    objectsToCheckObjectsFormat: async function (res,reqBody,...objectsToCheckObjectsFormat) {
        for (let i = 0; i < objectsToCheckObjectsFormat.length; i++) {
            let obj=reqBody[objectsToCheckObjectsFormat[i]]
            if( (typeof obj === "object" || typeof obj === 'function') && (obj !== null) )
            {
                return true;
            }else{
                var errorfield= await stringOperations.camalizeAndSpaceOnCapitalChar(objectsToCheckObjectsFormat[i]);
                await errorRes.errorCustomMessage(res, {mes:errorfield +" Must Be An Object"});
                throw new Error("Bad Request");
            }

        }
        return true;
    },

    ///////date operations
    convertToIsoDate: async function (res,dateValue){
        if(dateValue instanceof Date){
           return dateValue.toISOString();
        }else{
            dateValue=new Date(dateValue);
            console.log(dateValue);
            if(dateValue!=null && dateValue!=undefined && dateValue!="Invalid Date"){
                return dateValue.toISOString();
            }else{
                await errorRes.errorCustomMessage(res, {mes: "Please Provide Valid Date String Format"});
            }
        }
    },
    ///////date operations
    convertToIsoDatere: async function (res,dateValue){
        if(dateValue instanceof Date){
            return dateValue.toISOString();
        }else{
            dateValue=new Date(dateValue);
            console.log(dateValue);
            if(dateValue!=null && dateValue!=undefined && dateValue!="Invalid Date"){
                return dateValue.toISOString();
            }else{
                // await errorRes.errorCustomMessage(res, {mes: "Please Provide Valid Date String Format"});
            }
        }
    },

    isObject:async function (obj){
        if( (typeof obj === "object" || typeof obj === 'function') && (obj !== null) )
        {
            return true;
        }else{
            return false;
        }
    },
    padNumber:async function (digit,padTilldigit){
        let zeroString="";
        for(let i=0;i<padTilldigit;i++){
            zeroString=zeroString+"0";
        }
        let number = (zeroString+digit).slice(-padTilldigit);
        return number;
    },
    checkEmail:async function (email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    isoDateToDMYDate:async function (isoDate){
        date = new Date(isoDate);
        //return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
        if(isNaN(date.getFullYear())){
            return ""
        }else{
            return date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()
        }

    },
    currentDateDMY:async function (){
        date = new Date();
        //return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
        return date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()
    },
    generatedFilesName:async function (fileType){
        return constants.generatedFilesPrefix.default+"-"+String(Math.random()) + '-' + Date.now()+fileType
    },
    parseFloat2Digit:async function (number){
        try {
            let valueParsed = parseFloat(parseFloat(number).toFixed(2))
            return isNaN(valueParsed) ? 0 : valueParsed;
        } catch (e) {
            return 0
        }
    },
    getPercentage:async function (amount,percentage){
        let percengtAmount=parseFloat(parseFloat(amount)*percentage)/100
        return {
            amount:parseFloat(parseFloat(amount)+parseFloat(percengtAmount)).toFixed(2),
            percentAmount:parseFloat(percengtAmount).toFixed(2)
        }
    },

    convertToIsoDateThenDMY: async function (dateValue){
        if(dateValue instanceof Date){
            return dateValue.toISOString();
        }else{
            dateValue=new Date(dateValue);
            console.log(dateValue);
            if(dateValue!=null && dateValue!=undefined && dateValue!="Invalid Date"){
                date = new Date(dateValue.toISOString());
                return date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()
            }
        }
    },

    numberInWords:async function (num){
        var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

        num=await parseInt(num)

        if ((num = num.toString()).length > 9) return 'Number Is bigger';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
        return str;
    },
    dynamicSort:async function(property){

            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                if(sortOrder == -1){
                    return b[property].localeCompare(a[property]);
                }else{
                    return a[property].localeCompare(b[property]);
                }
            }

    },
};


module.exports.air={
    iataIncentiveCalculate:async function (iata,incentive){
        let response={};
        if (iata == '' || iata == null) {
            iata=0;
        }
        if (incentive == '' || incentive == null) {
            incentive=0;
        }
        if(iata!=0){
            response.totalPercentage=parseFloat(Number(iata))+parseFloat(Number(incentive)*0.95);
            response.finalPercentage=parseFloat(Number(100))-parseFloat(Number(response.totalPercentage));
        }else{
            response.totalPercentage=parseFloat(Number(incentive));
            response.finalPercentage=parseFloat(Number(100))-parseFloat(Number(response.totalPercentage));
        }
        return response;
    },
    emailBugs:async function (err,id,related){
        let bug=new models.mongo.bugEmailSend({
            issue: err,
            quoteId: id,
            related: related,
        });
        bug.save();
    },
}


module.exports.sendMail={
    mail:async function (message,relatedId,relatedName){
        // message.headers= {
        //     'Return-Path': envfile.nodeMailerMail
        // }
        // message.envelope={
        //     'from': envfile.nodeMailerMail,
        //         'to': envfile.nodeMailerMail
        // }
        let csbuddy = message.csBuddy;
        await models.mongo.adminMaster.findOne({_id: csbuddy}).then(
            async doc => {
                if (doc == null) {
                    await errorRes.errorCustomMessage(res, {mes: "CS buddy Not Available"});
                } else {
                    message.from = doc.email;
                }
            }).catch()
        if(message.from == undefined)
        {
            message.from=envfile.nodeMailerMail.from;
        }
        message.to.push(message.from)
        //message.to="akash@logycode.com";
        //message.html=" ";
       // console.log(JSON.stringify(message))
        return await models.mailer.sendMail(message, async function (err, info) {
            if (err) {
                console.log(err)
                let bug=new models.mongo.bugEmailSend({
                    issue: err,
                    quoteId: relatedId,
                    related: relatedName,
                });
                bug.save();
            } else {
                console.log(info);
            }
        });
    }


}


module.exports.text={
    wrap:async function (str, maxWidth){
        var newLineStr = "\n"; done = false; res = '';
        while (str.length > maxWidth) {
            found = false;
            // Inserts new line at first whitespace of the line
            for (i = maxWidth - 1; i >= 0; i--) {
                if (testWhite(str.charAt(i))) {
                    res = res + [str.slice(0, i), newLineStr].join('');
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            // Inserts new line at maxWidth position, the word is too long to wrap
            if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('');
                str = str.slice(maxWidth);
            }

        }
        return res + str;
    }
}

function testWhite(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};


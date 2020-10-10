const successRes = require('../../controllers/commonControllers/response/successRes');
module.exports = {
    objectsArray: async function (array, indexKey, valueForSearch) {
        var value = await loop(array, indexKey, valueForSearch);
        if (value.success == true) {
            return {success: true, result: value};
        } else {
            return {success: false, result: value};
        }
    }
}

function loop(array, indexKey, valueForSearch) {
    for (var i = 0; i < array.length; i++) {
        //console.log(array[i][indexKey]+"/"+valueForSearch);
        if (array[i][indexKey] == valueForSearch) {
            return {success: true, result: array[i], key: i, searchIndex: indexKey};
        }
    }
    return {success: false, result: []};
}

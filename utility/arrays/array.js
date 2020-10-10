module.exports.convertToArray = {
    viaParse: async function (parametersToConvert) {
        var a = parametersToConvert;
        a = a.replace(/'/g, '"');
        return JSON.parse(a);
    },
    ConvertStringToArrayInArrayOfObject: async function (arraydata,...indexName) {
        await arraydata.forEach(loop);
        function loop(item, index) {
            arraydata[index]=this.ConvertStringToArrayInObject(item,indexName.toString());
        }
        return arraydata;
    },
    ConvertStringToArrayInObject:async function(objectName,...allIndexName){
        for (let i = 0; i < allIndexName.length; i++) {
            objectName[allIndexName[i]]=JSON.parse(objectName[allIndexName[i]].replace(/'/g, '"'));
        }
        return objectName;
    }

}

module.exports.convertToString = {
    viaStringify: async function (parametersToConvert) {
        return JSON.stringify(parametersToConvert);
    }
}

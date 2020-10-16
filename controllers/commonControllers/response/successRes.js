module.exports = {
    Added: async function (res) {
        res.status(200).send({
            'success': true,
            'message': 'Added Successfully',
            'result': [],
        })
        // throw new Error("Success");
    },
    update: async function (res) {
        res.status(200).send({
            'success': true,
            'message': 'Updated Successfully',
            'result': [],
        })
        // throw new Error("Success");
    },
    delete: async function (res) {
        res.status(200).send({
            'success': true,
            'message': 'Deleted Successfully',
            'result': [],
        })
        // throw new Error("Success");
    },
    dataNotAvailable: async function (res) {
        res.status(200).send({
            'success': true,
            'message': '0 Rows Found',
            'result': [],
        })
        // throw new Error("Success");
    },
    successCustomMessage: async function (res, obj) {
        res.status(200).send({
            'success': true,
            'message': obj.mes,
            'result': obj.data,
            'schema': obj.data2,
        })
        // throw new Error("Success");
    },
    successErrorMessage: async function (res, obj) {
        res.status(200).send({
            'success': false,
            'message': obj.mes,
            'result': obj.data,
            'schema': obj.data2,
        })
        // throw new Error("Success");
    },
    successCustomMessageWithData: async function (res, obj) {
        // let data=[];
        // data.push(obj.data);
        // data.push(obj.total);
        // data.push(obj.start);
        res.status(200).send({
            'success': true,
            'message': obj.mes,
            'result': {data:obj.data,total:obj.total,start:obj.start}
        })
        // throw new Error("Success");
    },
    provideAccessToken: async function (res, obj) {
        res.status(200).send({
            'success': true,
            'message': "Login Successfully",
            'result': obj.data,
            'accessToken': obj.jwtToken,
        })
        // throw new Error("Success");
    },
};


module.exports = {
    parseMongoError: function (error) {
        if (error != null) {
            if (error.code === 11000 || error.code === 11001) {
                const pathRegex = error.message.match(/\.\$([a-z]+)/);
                const path = pathRegex ? pathRegex[1] : '';
                const keyRegex = error.message.match(/key:\s+{\s+:\s\"(.*)(?=\")/);
                const key = keyRegex ? keyRegex[1] : '';
                // return `${path} '${key}' already exists`;
                return 'already exists';
            } else if (error.name === 'ValidationError') {
                for (field in error.errors) {
                    console.log(error.errors[field].reason);
                    if (error.errors[field].kind === 'user defined') {
                        return error.errors[field].reason
                    } else {
                        return error.errors[field].message
                    }
                }
            }
        }
    }
};
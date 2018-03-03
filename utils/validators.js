const uuid_validator = require('uuid-validate');

module.exports = {
    verifyEmail: (email) => {
        let reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return reg.test(email);
    },
    verifyUUID: (uuid, version = 4) => {
        return uuid_validator(uuid, version)
    }
};

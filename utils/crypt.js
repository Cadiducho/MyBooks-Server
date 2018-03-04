const bcrypt = require('bcrypt-nodejs');
const crypt = require("crypto-js");

const e = module.exports = {
    bcrypt_encrypt: (message) => {
        return bcrypt.hashSync(message, bcrypt.genSaltSync(1000));
    },
    bcrypt_verify: (message, hash) => {
        return bcrypt.compareSync(message, hash);
    },

    random_int: (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    random_str: (len) => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < len; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

    sha256: (message) => {
        return crypt.SHA256(message).toString();
    },

    genClientToken: () => {
        const id = e.sha256(e.random_str(64));

        const token_raw = e.sha256(e.random_str(64));
        const token_hash = e.bcrypt_encrypt(token_raw);
        return {
            id: id,
            token: { raw: token_raw, hash: token_hash }
        }
    }
};

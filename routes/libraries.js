const validators = require('../utils/validators');
const crypt = require('../utils/crypt');
const database = require('../utils/database');
const authenticate = require('../utils/authenticate')
const uuid = require('uuid');

module.exports = (app) => {
    app.get('/v1/library', authenticate(), (request, response) => {
        const body = request.body;

        if (body.library_id === undefined) {
            response.json({ valid: false, message: "Invalid library uuid" });
            return;
        }

        if (!validators.verifyUUID(body.library_id)) {
            response.json({ valid: false, message: "Invalid library uuid" });
            return;
        }

        global.functions.isLibraryRegistered(body.library_id).then((exists => {
            if (!exists) {
                response.json({ valid: false, message: "That library doesn't exist" });
            }

            global.functions.getLibraryInfo(body.library_id, request.user_uuid).then(res => response.json(res));
        }))
    });
}

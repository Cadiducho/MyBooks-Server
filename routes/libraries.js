const validators = require('../utils/validators');
const authenticate = require('../utils/authenticate')

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

        global.functions.isLibraryRegistered(body.library_id).then(exists => {
            if (!exists) {
                response.json({ valid: false, message: "That library doesn't exist" });
            }

            global.functions.isUserInLibrary(body.library_id, request.user_uuid).then(isIn => {
                if (!isIn) {
                    response.json({valid: false, message: "You don't have permission to see this library"});
                    return;
                }

                global.functions.getLibraryInfo(body.library_id, request.user_uuid).then(res => response.json(res));
            });
        });
    });
};

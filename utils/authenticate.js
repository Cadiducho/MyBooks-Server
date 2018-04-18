module.exports = () => {
    return function (req, res, next) {
        global.functions.authRequest(req).then(auth => {
            if (auth.ok) {
                req.user_uuid = auth.user_uuid;
                next()
            } else {
                res.status(200).json(auth);
            }
        });
    }
}
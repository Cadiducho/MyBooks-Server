const validators = require('../utils/validators');
const crypt = require('../utils/crypt');
const database = require('../utils/database');

module.exports = (app) => {
    app.post('/user/login', (request, response) => {
        const body = request.body;

        getLoginResponse(body.email, body.password).then(res => {
            response.json(res);
        })
    });
}

const getLoginResponse = (email, password) => {
    return new Promise((promise_result, promise_error) => {
       promise_result({email: email, password: password})
    });
}

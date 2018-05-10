const validators = require('../utils/validators');
const crypt = require('../utils/crypt');
const database = require('../utils/database');
const authenticate = require('../utils/authenticate')
const uuid = require('uuid');

module.exports = (app) => {
    app.post('/v1/user/login', (request, response) => {
        const body = request.body;

        getLoginResponse(body.email, body.password).then(res => {
            response.json(res);
        })
    });
    app.post('/v1/user/register', (request, response) => {
       const body = request.body;

       getRegisterResponse(body.nick, body.name, body.email, body.password, body.re_password).then(res => {
           response.json(res);
       })
    });
    app.get('/v1/authTest', (request, response) => {
        global.functions.authRequest(request).then(auth => {
            if (auth.ok) {
                response.json({ok: true, test: auth})
            } else {
                response.json({ok: false, test: auth})
            }
        })
    });
    app.get('/v1/libraries', authenticate(), (request, response) => {
        global.functions.getUserLibraries(request.user_uuid).then(res => response.json(res));
    });
};

const getRegisterResponse = (nick, name, email, password, re_password) => {
    return new Promise((promise_result, promise_error) => {
        //Comprobar el nick
        if (nick === undefined) {
            promise_result({ valid: false, message: `El nick no puede ser nulo` });
            return;
        }
        if (nick.length < 3) {
            promise_result({ valid: false, message: `El nick debe contener más de 3 carácteres` });
            return;
        }

        //Comprobar el nombre
        if (name === undefined) {
            promise_result({ valid: false, message: `El nombre no puede ser nulo` });
            return;
        }
        if (name.length < 3) {
            promise_result({ valid: false, message: `El nombre debe contener más de 3 carácteres` });
            return;
        }

        //Comprobar el email
        if (email === undefined) {
            promise_result({ valid: false, message: `El email no puede ser nulo` });
            return;
        }
        if (!validators.verifyEmail(email)) {
            promise_result({ valid: false, message: `El correo electrónico no es valido` });
            return;
        }

        //Comprobar la contraseña
        if (password === undefined) {
            promise_result({ valid: false, message: `La contraseña no puede ser nula` });
            return;
        }
        if (password.length <= 6) {
            promise_result({ valid: false, message: `La contraseña debe contener más de 6 carácteres` });
            return;
        }
        if (re_password === undefined) {
            promise_result({ valid: false, message: `La confirmación de la contraseña no puede ser nula` });
            return;
        }
        if (password !== re_password) {
            promise_result({ valid: false, message: `Las contraseñas no coinciden` });
            return;
        }

        const sql_conn = database.connection();
        // Comprobar que ese nick o email no está ya registrado
        const query =
            `SELECT email, nick FROM Users
                    WHERE email=${sql_conn.escape(email)} 
                    OR nick=${sql_conn.escape(nick)}`;
        sql_conn.query(
            query,
            (sql_error, sql_results, sql_fields) => {
                if (sql_results.length !== 0) {
                    const sql_result = sql_results[0];

                    if (sql_result.email === email) {
                        promise_result({valid: false, message: `El correo electrónico ya esta registrado`});
                        return;
                    }

                    promise_result({valid: false, message: `El nick ya esta registrado`});
                    return;
                }

                //Insertar usuario
                const query =
                    `INSERT INTO Users(id, name, nick, email, hash) 
                            VALUES (
                            ${sql_conn.escape(uuid.v4())},
                            ${sql_conn.escape(name)},
                            ${sql_conn.escape(nick)},
                            ${sql_conn.escape(email)},
                            ${sql_conn.escape(crypt.bcrypt_encrypt(password))}
                            )`;
                sql_conn.query(
                    query,
                    () => {
                        promise_result({valid: true}); //Mandar usuario al login
                        sql_conn.end();
                    }
                );
            }
        );
    });
};

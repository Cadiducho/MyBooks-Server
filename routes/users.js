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
        //Comprobar que el email sea válido
        if (email === undefined || !validators.verifyEmail(email)) {
            promise_result({ok: false, message: `El correo electrónico no es valido`});
            return;
        }

        //Comprobar que la ccntraseña sea válida
        if (password === undefined) {
            promise_result({ok: false, message: `La contraseña no es valida`});
            return;
        }

        const sql_conn = database.connection();
        const query = `SELECT id, hash FROM Users WHERE email=${sql_conn.escape(email)}`;

        sql_conn.query(
            query,
            (sql_error, sql_results, sql_fields) => {
                //Comprobar que el mail exista en la base de datos
                if (sql_results === undefined) {
                    promise_result({ok: false, message: `El correo electrónico no esta registrado`});
                    return;
                }

                const sql_result = sql_results[0];
                if (sql_result === undefined) {
                    promise_result({ok: false, message: `El correo electrónico no esta registrado`});
                    return;
                }
                //Comprobar que la contraseña es correcta con el hash guardado
                if (!crypt.bcrypt_verify(password, sql_result.hash)) {
                    promise_result({ok: false, message: `La contraseña no coincide con el correo electrónico`});
                    return;
                }
                //Genera un client token
                const all_client_token = crypt.genClientToken();
                const client_id = all_client_token.id;
                const client_token = all_client_token.token;

                //Insertar un token asociado a este cliente y terminar correctamente
                const query =
                    `INSERT INTO UserSession(user_uuid, client_id, client_hash) 
                    VALUES (${sql_conn.escape(sql_result.id)},'${client_id}','${client_token.hash}')`;
                sql_conn.query(
                    query,
                    () => {
                        //Envía la id del cliente el token
                        promise_result({ok: true, client_id: client_id, client_token: client_token.raw});
                        sql_conn.end();
                    }
                );
            }
        );
    });
}

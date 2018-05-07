const database = require('./utils/database');
const crypt = require('./utils/crypt');

const e = global.functions = {
    authRequest: (request) => {
        return new Promise((promise_result, promise_error) => {
            const client_id = request.headers.client_id;
            const client_token = request.headers.client_token;

            if (client_id === undefined) {
                promise_result({ok: false, message: 'client_id can not be null'});
                return;
            }
            if (client_token === undefined) {
                promise_result({ok: false, message: 'client_token can not be null'});
                return;
            }

            const sql_conn = database.connection();
            const query =
                `SELECT user_uuid, client_hash 
                FROM UserSession 
                WHERE valid='1' AND DATE_ADD(creation,INTERVAL 30 DAY) > NOW()
                AND client_id=${sql_conn.escape(client_id)}`;
            sql_conn.query(query, (sql_error, sql_results, sql_fields) => {
                    const sql_result = sql_results[0];
                    const err_message = "El cliente no tiene este acceso permitido";

                    //Comprobar que hay un token válido asociado a ese client_id
                    if (sql_result === undefined) {
                        promise_result({ ok: false, message: err_message});
                        sql_conn.end();
                        return;
                    }

                    const client_hash = sql_result.client_hash;

                    //Comprobar que el token pasado coincide con el hash guardado
                    if (!crypt.bcrypt_verify(client_token, client_hash)) {
                        promise_result({ ok: false, message: err_message});
                        sql_conn.end();
                        return;
                    }

                    //Autentificación ok
                    promise_result({ ok: true, user_uuid: sql_result.user_uuid });
                    sql_conn.end();
                }
            );
        });
    },
    isLibraryRegistered: (library_id) => {
        return new Promise((promise_result, promise_error) => {
            const sql_conn = database.connection();
            const query = `
            SELECT COUNT(*) AS count 
            FROM Libraries 
            WHERE id=${sql_conn.escape(library_id)}`;
            sql_conn.query(query, (sql_error, sql_results, sql_fields) => {
                promise_result(sql_results[0].count === 1);
                sql_conn.end();
            });
        });
    },
    getLibraryInfo: (library_id, user_id) => {
        return new Promise((promise_result, promise_error) => {
            const sql_conn = database.connection();
            const query =
                `SET @lid=${sql_conn.escape(library_id)};
                SET @uid=${sql_conn.escape(user_id)};
                SELECT \`name\`, (SELECT COUNT(*) FROM UserLinkedLibraries WHERE \`library_uuid\`=@lid) as \`users\` FROM Libraries WHERE \`id\`=@lid;
SELECT \`can_add\`, \`can_edit\`, \`can_remove\`, \`can_invite\`, \`manager\`, \`owner\` FROM \`UserLinkedLibraries\` WHERE \`library_uuid\`=@lid AND \`user_uuid\`=@uid;`;
            sql_conn.query(query, (sql_error, sql_results, sql_fields) => {
                console.log(sql_error);
                let library = sql_results[0][0];
                if (sql_results[1][0] !== undefined) {
                    library.can_add = sql_results[1][0].can_add;
                    library.can_edit = sql_results[1][0].can_edit;
                    library.can_remove = sql_results[1][0].can_remove;
                    library.can_invite = sql_results[1][0].can_invite;
                    library.manager = sql_results[1][0].manager;
                    library.owner = sql_results[1][0].owner;
                }
                promise_result(library);
                sql_conn.end();
            });
        });
    }
}
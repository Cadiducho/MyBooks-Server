const mysql = require('mysql');

module.exports = {
    connection: () => {
        return mysql.createConnection(global.config.db);
    }
};
let mysql = require("mysql");
const toUnnamed = require('named-placeholders')();
const originalQuery = require('mysql/lib/Connection').prototype.query;

//Modify original mysql query to support named parameters
require('mysql/lib/Connection').prototype.query = function (...args) {
    if (Array.isArray(args[0]) || !args[1]) {
        return originalQuery.apply(this, args);
    }
    ([args[0], args[1]] = toUnnamed(args[0], args[1]));
    return originalQuery.apply(this, args);
};

class Dao {

    // noinspection JSUnusedGlobalSymbols
    /**
     * Singleton that gets a promise that passes the connection to mysql
     * @return {Promise}
     */
    get connection(){
        if (this.connectionPromise === null) {
            // noinspection JSUnresolvedFunction
            let conn = mysql.createConnection({
                host: global.config['db_host'],
                user: global.config['db_user'],
                password : global.config['db_password'],
                database : global.config['db_database']
            });

            this.connectionPromise = new Promise(function (resolve,reject) {
                conn.connect(function (err) {
                    if (err) reject(err);
                    resolve(conn);
                });
            });

            return this.connectionPromise;

        } else {
            return this.connectionPromise;
        }
    }


    // noinspection JSUnusedGlobalSymbols
    executeQuery(sql,values=[],callback) {
        this.connection.then(function (conn) {
            conn.query(sql,values,callback);
        }).catch(function (err) {
            console.log(err);
        });
    }

    constructor() {
        this.connectionPromise = this.connectionPromise || null;
    }
}
module.exports = Dao;
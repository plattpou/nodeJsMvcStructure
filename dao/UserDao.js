let Dao = require("./Dao");
let UserDto = require("../dto/UserDto");
let bCrypt = require("bcrypt");
class UserDao extends Dao {

    findByUsernameAndPassword(username,password, callback) {

        this.executeQuery("SELECT * FROM users WHERE username = ?",[username],function (err,result) {
            if (err) {
                callback(err,false);
            } else {
                if (result.length > 0) {
                    bCrypt.compare(password, result[0].password, function (err, matched) {
                        if (err) {
                            callback(err,false);
                        } else {
                            if (matched) {
                                callback(null, new UserDto(result[0]))
                            } else {
                                callback(new Error("User not found"), false);
                            }
                        }
                    });
                }
            }
        });

    }

    getById(userId, callback) {
        this.executeQuery("SELECT * FROM users WHERE id = ?",[userId],function (err,result) {
            if (err) {
                callback(err,false);
            } else {
                if (result.length > 0) {
                    callback(null,new UserDto(result[0]));
                }
            }
        });
    }


    // @todo: create a section where you use this method
    // noinspection JSUnusedGlobalSymbols
    createUser(userDto, callback) {

        let instance = this;
        bCrypt.hash(userDto.password, 10, function (err, hash) {
            userDto.password = hash;
            // noinspection JSUnusedLocalSymbols
            instance.executeQuery("INSERT INTO users (id,username,password,accessLevel,screenName) VALUES (:id,:username,:password,:accessLevel,:screenName)",
                userDto, callback || function (err,result) {}
            );
        });

    }



}
module.exports = UserDao;
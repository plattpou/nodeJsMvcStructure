let Dao = require("./Dao");
let UserDto = require("../dto/UserDto");
let bCrypt = require("bcrypt");
class UserDao extends Dao {

    findByUsernameAndPassword(username,password, callback) {
        console.log('getting user ' + username);

        let result = {
            username : username,
            accessLevel : 'admin',
            password : '123'
        };

        this.executeQuery("SELECT * FROM users WHERE username = ?",[username],function (err,result) {
            bCrypt.compare(password,result[0].password, function (err, matched) {
                if (matched) {
                    callback(new UserDto(result[0]))
                } else {
                    callback(false);
                }
            });
        });

    }

    createUser(userDto, callback) {

        let instance = this;
        bCrypt.hash(userDto.password, 10, function (err, hash) {
            console.log(hash);
            userDto.password = hash;
            // noinspection JSUnusedLocalSymbols
            instance.executeQuery("INSERT INTO users (id,username,password,accessLevel,screenName) VALUES (:id,:username,:password,:accessLevel,:screenName)",
                userDto, callback || function (err,result) {}
            );
        });

    }



}
module.exports = UserDao;
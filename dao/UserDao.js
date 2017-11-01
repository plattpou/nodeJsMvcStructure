let Dao = require("./Dao");
let UserDto = require("../dto/UserDto");
class UserDao extends Dao {

    findByUsername(username, callback) {
        console.log('getting user ' + username);

        let result = {
            username : username,
            accessLevel : 'admin',
            password : '123'
        };

        return new UserDto(result);

    }

    createUser(userDto, callback) {
        // noinspection JSUnusedLocalSymbols
        this.executeQuery("INSERT INTO users (id,username,password,accessLevel,screenName) VALUES (:id,:username,:password,:accessLevel,:screenName)",
            userDto, callback || function (err,result) {}
        );
    }



}
module.exports = UserDao;
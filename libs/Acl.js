let bCrypt = require("bcrypt");
let btoa = require("btoa");
let atob = require("atob");
class Acl {

    createLoginCookie(userDto, response) {
        let data = {
            id : userDto.id,
            ts : Date.now()
        };
        bCrypt.hash(JSON.stringify(data),10,function (err, signature) {
            data['signature'] = signature;
            response.cookie(global.config['session_user_cookie'],btoa(JSON.stringify(data)),{
                path : "/",
                maxAge : 3600000
            });
            response.json(data);
        });
    }

    updateLoginCookie(userDto, response) {

    }

}

module.exports = Acl;
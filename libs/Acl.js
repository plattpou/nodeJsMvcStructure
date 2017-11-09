let bCrypt = require("bcrypt");
let btoa = require("btoa");
let atob = require("atob");
let UserDao = require("../dao/UserDao");
class Acl {

    static createLoginCookie(userDto, response, callback) {
        let data = {
            id : userDto.id,
            ts : Date.now()
        };
        bCrypt.hash(JSON.stringify(data),10,function (err, signature) {

            if (err) {
                if (callback) {
                    callback(null, false);
                } else {
                    throw err;
                }
            } else {
                data['signature'] = signature;
                response.cookie(global.config['session_user_cookie'], btoa(JSON.stringify(data)), {
                    path: "/",
                    maxAge: global.config['session_user_cookie_max_age']
                });
                if (callback) callback(null,data);
            }
        });
    }


    middleware(req,res,next) {


        req.currentAccessLevel = 0;

        let cookie = atob(req.cookies[global.config['session_user_cookie']] || '');
        if (cookie !== '') {
            let cookieObj = JSON.parse(cookie);
            if (typeof cookieObj['id'] !== 'undefined') {
                let data = {
                    id : cookieObj['id'],
                    ts : cookieObj['ts']
                };
                let expectedSignature = cookieObj['signature'];
                bCrypt.hash(data,10,function (hash) {
                    bCrypt.compare(hash,expectedSignature,function (matched) {
                        if (matched) {
                            let userDao = new UserDao();
                            userDao.getById(data['id'],function (err, result) {
                                if (result !== false) {
                                    req.currentAccessLevel = global.accessLevels[result['accessLevel']] || 0;
                                    req.userDto = result;
                                    Acl.createLoginCookie(result,res,function (err,cookieData) {
                                        if (err) throw err;
                                        if (cookieData) {
                                            next();
                                        }
                                    });

                                } else {
                                    req.userDto = false;
                                    next();
                                }

                            });
                        } else {
                            next();
                        }
                    });
                })

            } else  {
                next();
            }

        } else {
            next();
        }

    }


}

module.exports = Acl;
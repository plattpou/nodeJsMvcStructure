let bCrypt = require("bcrypt");
let Acl = require("../libs/Acl");
// noinspection JSUnusedGlobalSymbols
module.exports = {

    get: function(req, res) {

        // noinspection JSUnresolvedFunction
        res.header('Content-Type','text/html');
        // noinspection JSUnresolvedFunction
        res.render('layout',{
            partial :  'login.ejs',
            windowTitle : global['config'].AppName + ' - Login',
            scripts : ['/js/login.js'],
            css : ['/css/login.css'],
            init : "<script>login.init(" + JSON.stringify({
                webRoot : global['webRoot']
            }) + ");</script>"
        });
    },

    /**
     * Handler for login - in.
     * @param req
     * @param res
     */
    post : function (req,res) {

        let UserDao = require("../dao/UserDao");
        let userDao = new UserDao();
        userDao.findByUsernameAndPassword(req.body['username'],req.body['password'],function (err,result) {
            if (result !== false) {
                Acl.createLoginCookie(result,res,function (err,cookieData) {
                    res.json(cookieData);
                });
            }
        });

    },

    //Optional, in case you need to execute something before every request
    init : function (app) {},

    //Optional, This allows to override the access denied action (default just json error)
    denied : function (req, res) {
        res.status(401).json({ "error" : "access denied" });
    }

};

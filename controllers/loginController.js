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

    post : function (req,res) {

        let UserDao = require("../dao/UserDao");
        let UserDto = require("../dto/UserDto");
        let userDao = new UserDao();

        console.log('GUID: ' + UserDto.createGUID('User'));

        let dto = new UserDto({
            id : UserDto.createGUID('User'),
            username : 'plattpou',
            password : 'A13x',
            accessLevel : 'developer',
            screenName : 'Alex Platt'
        });

        console.log(dto);

        userDao.createUser(dto);

        //let user = userDao.findByUsername(req.body['username']);

        //console.log(user.toArray());

        res.json(dto);
    },

    //Optional, in case you need to execute something before every request
    init : function (app) {},

    //Optional, This allows to override the access denied action (default just json error)
    denied : function (req, res) {
        res.status(401).json({ "error" : "access denied" });
    }

};

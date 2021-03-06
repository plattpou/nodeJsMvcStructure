// noinspection JSUnusedGlobalSymbols
module.exports = {

    get: function(req, res) {
        // noinspection JSUnresolvedFunction
        res.header('Content-Type','text/html');
        // noinspection JSUnresolvedFunction
        res.render('layout',{
            partial :  'index.ejs', //from views folder
            windowTitle : global['config'].AppName, //browser title
            scripts : ['/js/index.js'], //javascripts before body ends
            css : ['/css/index.css'], //css to include
            init : "<script>index.init(" + JSON.stringify({
                webRoot : global['webRoot']
            }) + ");</script>" //Snippet to execute allows to pass parameters into your scripts
        });
    },

    //Optional, in case you need to execute something before every request
    init : function (app) {},

    //Optional, This allows to override the access denied action (default just json error)
    // denied : function (req, res) {
    //     res.status(401).json({ "error" : "access denied" });
    // }

};


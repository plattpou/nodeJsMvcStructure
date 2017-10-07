// noinspection JSUnusedGlobalSymbols
module.exports = {

    get: function(req, res) {
        res.header('Content-Type','text/html');
        res.render('layout',{
            partial :  'index.ejs', //from views folder
            windowTitle : 'My App', //browser title
            scripts : ['/js/index.js'], //javascripts before body ends
            css : ['/css/index.css'], //css to include
            init : "<script>index.init(" + JSON.stringify({
                webRoot : global['config']['webRoot']
            }) + ");</script>" //Snippet to execute allows to pass parameters into your scripts
        });
    },

    init : function (app) {
        //in case you need to execute something before every request
    }

};


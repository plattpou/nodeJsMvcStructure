let express = require('express');
let bodyParser = require('body-parser');
let server = require('http');
let app = express(server);
let session = require('express-session');
let Acl = require(__dirname + "/libs/Acl");
let cookieParser = require('cookie-parser');

// noinspection JSUnresolvedFunction
app.set('view engine','ejs');
// noinspection JSUnresolvedFunction
app.set('views', __dirname + '/views');

console.log('Loading App..');

let fs = require('fs');

let promiseConfigs = new Promise(function (resolve, reject) {
    fs.readFile(__dirname + '/config.json','utf8',function (err, data) {
        if (err) throw err;
        try {
            resolve(JSON.parse(data))
        } catch(ex) {
            reject('Error Parsing Configs');
        }
    });
});

let promiseRoutes = new Promise(function (resolve, reject) {
    fs.readFile(__dirname + '/routes.json','utf8',function (err, data) {
        if (err) throw err;
        try {
            resolve(JSON.parse(data))
        } catch (ex) {
            reject('Error parsing routes');
        }
    });
});


//Loader
Promise.all([
    promiseConfigs,
    promiseRoutes
]).then(function ([config,routes]) {

    global['config'] = config;
    global['accessLevels'] = routes['roles'] || {};
    global['webRoot'] = global['config']['host'] + ((global['config']['port'] !== 80) ? ":" + global['config']['port'] : "");

    //Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    // noinspection JSUnresolvedFunction
    app.use(express.static(__dirname + '/public'));
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    app.use(session({secret:global['config'].session_secret, resave: false, saveUninitialized:true}));

    //Access Control Middleware
    let acl = new Acl();
    app.use(acl.middleware);


    //Load all routes
    routes['routes'].forEach(function (route) {
        let controller = require('./controllers/' + route['controller'] + '.js');
        route['actions'].forEach(function (actionData) {

            let action = Object.keys(actionData)[0];
            let minAccess = routes['roles'][actionData[action]];

            app[action](route['url'], function (req, res) {

                if (req.currentAccessLevel >= minAccess) {
                    if (typeof controller['init'] !== 'undefined') {
                        controller['init'](app);
                    }
                    if (typeof controller[action] !== 'undefined') {
                        controller[action](req,res);
                    } else {
                        console.warn(`Method ${action} is not implemented in controller ${route[controller]} accessed by: ${route['url']}`)
                    }
                } else {
                    if (typeof controller['denied'] !== 'undefined') {
                        controller['denied'](req,res);
                    } else {
                        if (action === 'get' && routes['defaultDeniedUrl'] !== '') {
                            res.redirect(routes['defaultDeniedUrl']);
                        } else {
                            res.status(401).json({"error": "access denied"});
                        }
                    }
                }

            });

        })
    });

    // noinspection JSUnresolvedFunction
    app.listen(config['port'],function () {
        console.log(`${global.config['AppName']} Listening on ${global.config['host']}:${global.config['port']}`);
    });
});

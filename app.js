let express = require('express');
let server = require('http');
let app = express(server);
let session = require('express-session');

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

    //Middleware
    // noinspection JSUnresolvedFunction
    app.use(express.static(__dirname + '/public'));
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    app.use(session({secret:global['config'].session_secret, resave: false, saveUninitialized:true}));

    //@todo: create middleware to validate and use session cookie and set it to currentAccessLevel
    let currentAccessLevel = 0; //any by default

    //Load all routes
    routes['routes'].forEach(function (route) {
        let controller = require('./controllers/' + route['controller'] + '.js');
        route['actions'].forEach(function (actionData) {

            let action = Object.keys(actionData)[0];
            let minAccess = routes['roles'][actionData[action]];

            if (currentAccessLevel >= minAccess) {
                if (typeof controller['init'] !== 'undefined') {
                    controller['init'](app);
                }

                //try to execute the action(method) from the controller, or warn
                app[action](route['url'], controller[action] || function () {
                    console.warn(`Method ${action} is not implemented in controller ${route[controller]} accessed by: ${route['url']}`)
                });

            } else {
                app[action](route['url'], controller['denied'] || function (req, res) {
                    res.status(401).json({ "error" : "access denied" });
                });
            }

        })
    });

    // noinspection JSUnresolvedFunction
    app.listen(config['port'],function () {
        console.log(`${global.config['AppName']} Listening on ${global.config['host']}:${global.config['port']}`);
    });
});




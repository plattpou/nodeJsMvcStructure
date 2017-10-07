let express = require('express');
let server = require('http');
let app = express(server);

// noinspection JSUnresolvedFunction
app.set('view engine','ejs');
// noinspection JSUnresolvedFunction
app.set('views', __dirname + '/views');
// noinspection JSUnresolvedFunction
app.use(express.static(__dirname + '/public'));

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
    routes['routes'].forEach(function (route) {
        let controller = require('./controllers/' + route['controller'] + '.js');
        route['actions'].forEach(function (action) {

            if (typeof controller['init'] !== 'undefined') {
                controller['init'](app);
            }

            //try to execute the action(method) from the controller, or warn
            app[action](route['url'], controller[action] || function () {
                console.warn(`Method ${action} is not implemented in controller ${route[controller]} accessed by: ${route['url']}`)
            });
        })
    });

    // noinspection JSUnresolvedFunction
    app.listen(config['port'],function () {
        console.log(`${global.config['AppName']} Listening on ${global.config['host']}:${global.config['port']}`);
    });
});




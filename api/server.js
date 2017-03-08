
// BASE SETUP
// =============================================================================
"use strict";
var config = require("freds-config");
var mongoose = require('mongoose');
var mongoUri = config.get('mongo.uri');
var mongoOptions = config.get('mongo.options');

var express = require('express'); // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

var util = require("util");
var cors = require("cors");

// The request handler must be the first item

var FredsLogger = require("freds-logger");
var logger = new FredsLogger({ appName: require("./package.json").name });
logger.add(logger.transports.File, { filename: 'output_logs/output.log' });
logger.level = config.get("logger.level");


var Server = function () {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.options("*");

    var corsOptions = {
        origin: true,
    };

    app.use(cors(corsOptions));

    var OffsetModel = require('./models/offsetModel');
    var OffsetController = require('./controllers/offsetController')({ "OffsetModel": OffsetModel });

    var passport = require("passport");
    var BearerStrategy = require("passport-http-bearer");
    var http = require("http");
    var https = require("https");
    var url = require("url");
    var authHostName = config.get("authentication.hostname");
    var router = express.Router();

    passport.use(new BearerStrategy(
        function (token, done) {
            logger.debug("token:", token);
            var options = url.parse(authHostName);
            options.headers = {
                "Authorization": "bearer " + token
            };
            logger.info("Authenticating Request...");
            var protocolType = https;
            if (options.protocol === 'http:') {
                protocolType = http;
            }

            protocolType.get(options, function (res) {
                if (res.statusCode === 200) {
                    res.on("data", function (chunk) {
                        logger.info("Authenticated...");
                        var session = JSON.parse(chunk.toString());
                        logger.debug("Session...", session);
                        var allowedRoles = config.get("allowedRoles");
                        var userRoles = session.user.roles;
                        var authorizedRoles = allowedRoles.filter(function (role) {
                            return role === "*" || userRoles.indexOf(role) != -1;
                        });
                        return done(null, session, 'all')
                        // if (authorizedRoles.length > 0) {
                        //     return done(null, session, 'all');
                        // }
                        // else {
                        //     logger.info("User " + session.user.userId + " does not have one of the required allowedRoles: [" + allowedRoles.join(", ") + "]");
                        //     return done(null, false);
                        // }
                    });
                }
                else {
                    return done(null, false);
                }
            }).on("error", function (e) {
                done(e, null, false);
            });

        }));


    app.get("/heartbeat", function (req, res) {
        return res.status(200).send();
    });

    router.use(passport.authenticate('bearer', { session: false }));

    router.route('/create')
        .post(OffsetController.create);

     router.route('/read/:entityKey')
        .get(OffsetController.read);

    router.route('/update')
        .post(OffsetController.update);

     router.route('/list')
        .post(OffsetController.list);

    app.use('/', router);

    // START THE SERVER
    // =============================================================================

    var port = config.get("server.port");

    var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;

        logger.info("We are listening on http://%s:%s", host, port);
    });

};

var init = function () {
    mongoose.connection.on('connecting', function () {
        logger.info('connecting');
    });

    mongoose.connection.on('error', function (error) {
        logger.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });

    mongoose.connection.on('connected', function () {
        logger.info('connected!');
    });

    mongoose.connection.once('open', function () {
        logger.info('connection open');
        new Server(); // Server is started once database connection is open.
    });

    mongoose.connection.on('reconnected', function () {
        logger.info('reconnected');
    });

    mongoose.connection.on('disconnected', function () {
        logger.info('disconnected');
        logger.info('mongoUri is: ' + mongoUri);
        setTimeout(function () {
            mongoose.connect(mongoUri, mongoOptions);
        }, 500);
    });

    mongoose.connect(mongoUri, mongoOptions);
};

init();
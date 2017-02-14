const express = require('express');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errors = require('./utils/errors');
const config = require('./config');
const session = require('express-session');
const app = express();

const dbcontext = require('./context/db')(Sequelize, config);

const authorService = require('./services/author')(dbcontext.author, errors);
const userService = require('./services/user')(dbcontext.user, dbcontext.role, errors);
const roleService = require('./services/role')(dbcontext.role, errors);
const authService = require('./services/auth')(dbcontext.user, dbcontext.role, errors);
const bookService = require('./services/book')(dbcontext.book,dbcontext.library,dbcontext.author,errors);
const libraryService = require('./services/library')(dbcontext.library,errors);
const cacheService = require('./services/cache');

const apiController = require('./controllers/api')(libraryService, bookService, authorService, userService, roleService,
      authService, cacheService, config);

const logger = require('./utils/logger');
const auth = require('./utils/auth')(authService, config, errors);
const cache = require('./utils/cache')(cacheService);


var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;


passport.use(new Strategy({
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        callbackURL: config.twitter.callbackURL
    },
    (token, tokenSecret, profile, cb) => {
        dbcontext.user
            .findOrCreate({
                where: {
                    firstname: profile.username,
                }
            })
            .then((user) => {
                dbcontext.userRole.create({
                    userId: user[0].dataValues.id,
                    roleId: 2
                });

                console.log(user[0].dataValues);
                cb(null, user[0].dataValues);
            })

    }));



passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});


app.use(express.static('public'));
app.use(cookieParser(config.cookie.key));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', logger);
app.use('/api', auth);
app.use('/api', cache);
app.use('/api', apiController);


dbcontext.sequelize
    .sync()
    .then(() => {
        app.listen(3000, () => console.log('Running on http://localhost:3000'));
    })
    .catch((err) => console.log(err));
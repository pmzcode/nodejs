/**
 * Created by MSI on 15.02.2017.
 */

var _ = require("lodash");
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const config = require('./config');
var dbcontext = require('./context/db')(Sequelize, config);

var passport = require("passport");
var passportJWT = require("passport-jwt");


const userService = require('./services/user')(dbcontext.user, dbcontext.domain);
const domainService = require('./services/domain')(dbcontext.domain);
const apiController = require('./controllers/api')( userService, domainService, config);

var app = express();



app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(bodyParser.json());


app.use(express.static('public'));

app.get("/", function(req, res) {
    res.json({message: "Express is up!"});
});

app.use('/api', apiController);

dbcontext.sequelize
    .sync()
    .then(() => {
        app.listen(3000, () => console.log('Running on http://localhost:3000'));
    })
    .catch((err) => console.log(err));

/*
app.listen(3000, function() {
    console.log("Express running");
});*/
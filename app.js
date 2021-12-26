///jshint esversion:6

require("dotenv").config()
var express  = require('express');
var app      = express();
var port     = 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
// app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
})) // get information from html forms

app.use(express.static("public"))
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

var Account = require('./app/models/accounts')

var newAccount = new Account()

newAccount.accountNo = "2021909986452"
newAccount.pin = newAccount.generateHash("9134")
newAccount.contact = "+91 87094 94652"
newAccount.address = "402 Magalam Building, Kolkata, West Bengal, 700001"
newAccount.name = "Ashish Kumar Gupta"

// newAccount.save()
///jshint esversion:6

require("dotenv").config()
var express  = require('express')
var app      = express()
var mongoose = require('mongoose')
var passport = require('passport')
var flash    = require('connect-flash')

var morgan       = require('morgan')
// var cookieParser = require('cookie-parser')
var bodyParser   = require('body-parser')
var session      = require('express-session')

var configDB = require('./config/database.js')

// configuration ===============================================================
mongoose.connect(configDB.url, {useNewUrlParser: true}) // connect to our database

require('./config/passport')(passport) // pass passport for configuration

// set up our express application
app.use(morgan('dev')) // log every request to the console
// app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
})) // get information from html forms

app.use(express.static("public"))
app.set('view engine', 'ejs') // set up ejs for templating

// required for passport
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport) // load our routes and pass in our app and fully configured passport

// launch ======================================================================
let port = process.env.PORT
if (port == null || port == "") {
  port = 8000
}
app.listen(port)
console.log('The magic happens on port ' + port)

// var Account = require('./app/models/accounts')
// var account = "2021991123405"
// update = {"$set" : {creditCard: [{

//     cardNumber: "9873 8453 2398 2351",
//     expiry: "05/25",
//     cardname: "Chinmay Bhalodiya"
// },
// {
//     cardNumber: "9873 9234 2394 2934",
//     expiry: "07/22",
//     cardname: "Chinmay Bhalodiya"

// }

// ] }}
// Account.findOneAndUpdate({accountNo: account}, update, {new: true}, function(err, update) {
//     if(err)
//         console.log(err)

//     console.log("card added")
// })

// // newAccount.save()
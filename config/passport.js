// load all the things we need
var LocalStrategy = require('passport-local').Strategy

// load up the user model
var BankUser = require('../app/models/user')
var account = require('../app/models/accounts')

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        BankUser.findById(id, function (err, user) {
            done(err, user)
        })
    })

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {
                

                account.findOne({accountNo: req.body.accountNo}, function(err, foundAccount) {
                    if(err)
                        return done(err)
                    if(!foundAccount)
                        return done(null, false, req.flash('signupMessage', 'Account Not found'))
                    if(!foundAccount.validPassword(req.body.pin))
                        return done(null, false, req.flash('signupMessage', 'Incorrect Pin'))
                    else{
                        
                        BankUser.findOne({ 'local.username': username }, function (err, user) {
                            // if there are any errors, return the error
                            if (err)
                                return done(err)
        
                            // check to see if theres already a user with that email
                            if (user) {
                    
                                return done(null, false, req.flash('signupMessage', 'Username already taken.'))
                            }
                            if(req.body.password != req.body.cpassword){
                                return done(null, false, req.flash('signupMessage', 'Password Does not match'))
                            } 
                            else {
        
                                var newUser = new BankUser()
                        
                                newUser.personal.accountNo = req.body.accountNo
                                newUser.personal.pin = foundAccount.pin
                                newUser.personal.contact = foundAccount.contact
                                newUser.personal.name = foundAccount.name
                                newUser.personal.address = foundAccount.address
                                newUser.creditCard = foundAccount.creditCard
                                newUser.local.email = req.body.email
                                newUser.local.password = newUser.generateHash(password)
                                newUser.local.username = username
                                newUser.balance = 40000
        
                                // save the user
                                newUser.save(function (err) {
                                    if (err)
                                        throw err
                                    return done(null, newUser)
                                })
                            }
        
                        })
                    }
                })

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists

            })

        }))


    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { 
        BankUser.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err)

            // if no user is found, return the message
            if (!user){
                return done(null, false, req.flash('loginMessage', 'No user found.')) // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')) // create the loginMessage and save it to session as flashdata
            }

            // all is well, return successful user
            return done(null, user)
        })

    }))

    passport.use('local-transfer', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'pin',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, pin, done) { 
        var current = req.user.balance
        update = {balance: current-req.body.amount}
        BankUser.findOneAndUpdate({ 'local.username' :  username }, update, {new: true}, function(err, foundUser) {
            if (err)
                return done(err)

            if (!foundUser.validPin(pin)){
                return done(null, false, req.flash('transferMessage', 'Oops! Wrong pin.')) // create the loginMessage and save it to session as flashdata
            }
            updates = {"$push" : {transaction: [{

                    sendAccount: req.body.sendaccount,
                    sendName: req.body.sendname,
                    sendAmount: req.body.sendamount,
                }
                ] }}
            BankUser.findOneAndUpdate({'local.username' : username}, updates, {new: true}, function(err, upadateTransaction) {
                if(err)
                    return done(err)
            })
            return done(null, foundUser)
        })

    }))

}
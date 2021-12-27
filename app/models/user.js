// load the things we need
var mongoose = require('mongoose')
var bcrypt   = require('bcrypt-nodejs')

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        username     : String,
        email        : String,
        password     : String,
    },
    personal         : {
        name         : String,
        accountNo    : String,
        pin          : String,
        contact      : String,
        address      : String,
    },
    balance          : Number,
    creditCard       : [{
        cardNumber       : String,
        cardname             : String,
        expiry           : String
    }],
    transaction      : [{
        sendAccount  : String,
        sendName     : String,
        sendAmount   : Number,
    }]
})

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
}
userSchema.methods.validPin = function(pin) {
    return bcrypt.compareSync(pin, this.personal.pin)
}
// create the model for users and expose it to our app
module.exports = mongoose.model('BankUser', userSchema)
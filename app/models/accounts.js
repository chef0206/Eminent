// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var accountSchema = mongoose.Schema({
    accountNo        : String,
    pin              : String,
    contact          : String,
    address          : String,
    name             : String,

    creditCard       : [{
        cardNumber       : String,
        cardname         : String,
        expiry           : String
    }]
});

// methods ======================
// generating a hash
accountSchema.methods.generateHash = function(pin) {
    return bcrypt.hashSync(pin, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function(pin) {
    return bcrypt.compareSync(pin, this.pin);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('account', accountSchema);
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var accountSchema = mongoose.Schema({
    accountNo        : Number,
    pin              : Number,
});

// methods ======================
// generating a hash
accountSchema.methods.generateHash = function(pin) {
    return bcrypt.hashSync(pin, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function(pin) {
    return bcrypt.compareSync(pin, this.local.pin);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Account', accountSchema);
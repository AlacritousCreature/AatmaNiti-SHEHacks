var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    username: String,
    password: String,
    phone: String,
    image: String,
    email: String,
    aadhar: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
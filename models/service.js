var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ServiceSchema = new Schema({
    servicename: String,
    servicetype: String,
    owner: String,
    city: String,
    state: String,
    phone: String,
    image: String,
    email: String,
    description: String,
});

module.exports = mongoose.model("Service", ServiceSchema);
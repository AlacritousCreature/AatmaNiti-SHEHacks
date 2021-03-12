var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var JobSchema = new Schema({
    position: String,
    organisation: String,
    experience: String,
    city: String,
    state: String,
    info: String,
    qualification: String,
    startdate: Date,
    lastdate: Date,
});

module.exports = mongoose.model("Job", JobSchema);
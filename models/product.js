var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    productname: String,
    producttype: String,
    producer: String,
    city: String,
    state: String,
    phone: String,
    image: String,
    price: String,
    quantity: String,
});

module.exports = mongoose.model("Product", ProductSchema);
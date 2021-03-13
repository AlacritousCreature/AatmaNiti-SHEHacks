const express = require("express"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    Job = require("./models/job"),
    Product = require("./models/product")

const app = express();
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

mongoose.set('useUnifiedTopology', true);
const url = process.env.MONGODB_URI || 3000

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}, () => {
    console.log("Connected to database.");
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "oh! bhaieee, kya majak ho rha hai ye????",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//===routes====
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/programsAndEvents", (req, res) => {
    res.render("programsAndEvents");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/login", (req, res) => {
    res.render("login", { page: 'login' });
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {});

// LOGOUT ROUTE
app.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// user model==========================================

/*var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    blood: String,
    username: String,
    password: String,
    phone: String,
    email: String,
    aadhar: String,
});

var User = mongoose.model("User", userSchema);*/

app.get("/user", (req, res) => {
    User.find({}, (err, allUsers) => {
        if (err) {
            console.log(err);
        } else {
            res.render("user", { users: allUsers });
        }
    });
});

app.post("/user/new", (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var address = req.body.address;
    var city = req.body.city;
    var state = req.body.state;
    var username = req.body.username;
    var password = req.body.password;
    var phone = req.body.phone;
    var email = req.body.email;
    var aadhar = req.body.aadhar;
    var newUser = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        state: state,
        username: username,
        password: password,
        phone: phone,
        email: email,
        aadhar: aadhar,
    };
    User.register(newUser, req.body.password, (err, newlyCreated) => {
        if (err) {
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/");
        });
    });
});

app.get("/user/new", (req, res) => {
    res.render("register");
});



app.get("/user/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            res.render("userProfile", { user: foundUser });
        }
    });

});
//==================================================

// job model=============================
/*var JobSchema = new mongoose.Schema({
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

var Job = mongoose.model("Job", JobSchema);*/


app.get("/jobs", (req, res) => {
    Job.find({}, (err, allJobs) => {
        if (err) {
            console.log(err);
        } else {
            res.render("jobs", { jobs: allJobs });
        }
    });
});

app.post("/jobs", isLoggedIn, (req, res) => {
    var position = req.body.position;
    var organisation = req.body.organisation;
    var experience = req.body.experience;
    var city = req.body.city;
    var state = req.body.state;
    var info = req.body.info;
    var qualification = req.body.qualification;
    var startdate = req.body.startdate;
    var lastdate = req.body.lastdate;
    var newJob = {
        position: position,
        organisation: organisation,
        experience: experience,
        city: city,
        state: state,
        info: info,
        qualification: qualification,
        startdate: startdate,
        lastdate: lastdate,
    };
    Job.create(newJob, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("jobs");
        }
    });
});

app.get("/jobs/new", isLoggedIn, (req, res) => {
    res.render("newjob");
});

//==================================


// product model===================
/*var ProductSchema = new mongoose.Schema({
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

var Product = mongoose.model("Product", ProductSchema);*/

app.get("/products", (req, res) => {
    Product.find({}, (err, allProducts) => {
        if (err) {
            console.log(err);
        } else {
            res.render("products", { products: allProducts });
        }
    });
});

app.post("/products", isLoggedIn, (req, res) => {
    var productname = req.body.productname;
    var producttype = req.body.producttype;
    var producer = req.body.producer;
    var city = req.body.city;
    var state = req.body.state;
    var phone = req.body.phone;
    var image = req.body.image;
    var quantity = req.body.quantity;
    var price = req.body.price;
    var newProduct = {
        productname: productname,
        producttype: producttype,
        producer: producer,
        city: city,
        state: state,
        phone: phone,
        image: image,
        quantity: quantity,
        price: price,
    };

    Product.create(newProduct, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("products");
        }
    });
});

app.get("/products/new", isLoggedIn, (req, res) => {
    res.render("newproduct");
});
//======================================

let port = process.env.PORT || 3000
app.listen(port, process.env.IP, () => {
    console.log("showing on port 3000.");
});
const express = require("express"),
    mongoose = require("mongoose"),
    nodemailer = require("nodemailer"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    Job = require("./models/job"),
    Product = require("./models/product");

var multiparty = require('multiparty');
const { initialize } = require("passport");
require("dotenv").config();

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

//Mail configuration

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        // TURN ON ACCESS TO LOW SECURITY APPS FOR THIS EMAIL.
        user: 'IIT2019007@iiita.ac.in',
        pass: 'Sam@1234',
    },
});

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
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

// middleware for login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login first!");
    res.redirect("/login");
}

// user model==========================================

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
    var image = req.body.image;
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
        image: image,
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
    res.render("register", { page: 'register' });
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

app.post("/send", (req, res) => {
    //1.
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function(err, fields) {
        // console.log(fields);
        Object.keys(fields).forEach(function(property) {
            data[property] = fields[property].toString();
        });

        //2. You can configure the object however you want
        const mail = {
            from: data.name,
            // 
            to: 'IIT2019007@iiita.ac.in',
            subject: data.subject,
            text: `${data.name} <${data.email}> \n${data.message}`,
        };

        //3.
        transporter.sendMail(mail, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send("Something went wrong.");
            } else {
                res.status(200).send("Email successfully sent to recipient!");
            }
        });
        res.render("home");
    });
});

//======================================

let port = process.env.PORT || 3000
app.listen(port, process.env.IP, () => {
    console.log("showing on port 3000.");
});
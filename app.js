const express = require('express');
require('dotenv').config();
const path = require('path');
const flash = require('express-flash');
const hbs = require('hbs');
// var http = require('http');
// var https = require('https');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var fs = require('fs-extra');
const mongoose = require('mongoose');
const routes = require('./routes/index.js');
const app = express();

//const probit = require('./routes/probit.js');

//db connectivity mongodb://user:<secure password 2>@localhost:27017/user_db?authSource=admin
mongoose.connect("mongodb://localhost/ARTW",{useNewUrlParser:true,useUnifiedTopology:true});
// mongoose.connect('mongodb://artWuser:Lo16a89r68tmain@localhost:27017/ArtW_DB_live?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true })
//    .then(() => console.log('MongoDB Database Connected'))
//    .catch(err => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(function (req, res, next) {
//    // console.log("httttttt", )
//    if (req.secure) {
//       return next();
//    } else {
//       res.redirect("https://" + req.headers.host + req.url);
//    }
// });

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(cookieParser('keyboard cat'));
app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: true,
   //cookie: { maxAge: 60000 }
}));
app.use(flash());

hbs.registerPartials(__dirname + '/views/admin/admin-login/partials');

// app.get('*', function (req, res, next) {
//    res.locals.cart = req.session.cart;
//    res.locals.user = req.user || null;
//    next();
// });

app.use('/', routes);

// var options = {

//    key: fs.readFileSync("/etc/ssl/private/private.key"),

//    cert: fs.readFileSync("/etc/ssl/certificate.crt"),

//    ca: fs.readFileSync('/etc/ssl/ca_bundle.crt')

// };

//app.listen(80);


// Create an HTTP service.
//http.createServer(app).listen(80);

// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(443);
app.listen(3000, () => console.log(`App listening on port 3000!`));
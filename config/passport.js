var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../models/admin');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {
 
    passport.use(new LocalStrategy(function (username, password, done) {
     console.log(username);
        Admin.findOne({email: username}, function (err, user) {

            //return res.send(user);
          
            if (err)
                console.log(err);

            if (!user) {
                return done(null, false, {message: 'Invalid Email or Password.'});
            }

            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err)
                    console.log(err);

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Email or Password.'});
                }
            });
        });

    }));

    passport.serializeUser(function (user, done) {
       
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
    
        Admin.findById(id, function (err, user) {
            done(err, user);
        });
    });

}


const { AdminInfo } = require('../models/admin');
const { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo } = require('../models/contact');

const findAdmin = async (email) => {
    let user = await AdminInfo.findOne({ 'email': email });
    if (user) {
        return user;
    }
    else {
        return 'notAdmin'
    }
};

const checkAdminPass = async (email, password) => {
    let user = await AdminInfo.findOne({ 'email': email, 'password': password });
    if (user) {
        return user;
    }
    else {
        return 'wrongPassword'
    }
};

const checkAdminId = async (user_id) => {
    let user = await AdminInfo.findOne({ '_id': user_id });
    if (user) {
        return user;
    }
};

const createSession = async (req, admin) => {
    req.session.user_main_id = admin._id;
    req.session.user_name = admin.name;
    req.session.profile_image = admin.profile_image;
    req.session.re_usr_email = admin.email;
    req.session.user_type = admin.user_type;

    /*******Call save function to store****/

    req.session.save(function (err, res) {
        console.log('saved?!');
        //console.log(`Error`, err)
        //console.log(`Session`, res)
        return req.session
    });
};

const activateUser = async (req, res) => {
    var user_id = req.query.id.trim();
    console.log("activateUser-54", user_id)
    Registration.updateOne({ 'email': user_id }, { $set: { 'status': 'active' } }, { upsert: true }, function (err, result) {
        if (err) { console.log(err); }
        else {
            req.flash('success_msg', 'User has been activated successfully.');
            res.redirect('/user-list');
        }
    })
}

const deactivateUser = async (req, res) => {
    var user_id = req.query.id.trim();
    console.log("deactivateUser-65", user_id)
    Registration.updateOne({ 'email': user_id }, { $set: { 'status': 'inactive' } }, { upsert: true }, function (err, result) {
        if (err) { console.log(err); }
        else {
            req.flash('success_msg', 'User has been deactivated successfully.');
            res.redirect('/user-list');
        }
    })
}

module.exports = {
    checkAdminPass,
    findAdmin,
    checkAdminId,
    createSession,
    activateUser,
    deactivateUser
}
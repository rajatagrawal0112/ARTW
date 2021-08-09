const express = require('express');

const session = require('express-session');

const flash = require('req-flash');

const multer = require('multer');
var crypto = require('crypto');

const request = require('request');
// var async = require('async');
const fs = require('fs');

var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
// var bip39 = require('bip39');

// var qr = require('qr-image'); 
const formidable = require('formidable');

const routes = require('express').Router();

const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');

const admin_wallet = '0x4e5e18E73783fe6b0f4D086384D20ae8d728a1a2';

var mkdirp = require('mkdirp');

const bcrypt = require('bcryptjs');
const { middleware_check_login, check_user_login } = require('../middleware/login_middleware');

const bscHelper = require("../helper/bscHelper")
const ethHelper = require("../helper/ethHelper")
const userServices = require("../services/userServices")
const adminServices = require("../services/adminServices")

// const {mongoose} = require('../config/config');
// const {AdminInfo,RECDetails,Tokensettings,ContactInfo} = require('../model/schema/admin');
// const {Userwallet,Importwallet,Tokendetails} = require('../model/schema/wallet');
const { TeamMember } = require('../models/team_info');
const { BannerInfo, GetInTouch, PartnerInfo, MediaCoverage } = require('../models/home_content');
let { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo } = require('../models/contact');
let { VAULT, MVAULT } = require('../models/vault');
let { VaultRate } = require('../models/vault_admin');
const { AdminInfo } = require('../models/admin');

const mailer = require('../helper/mailer.js');

const Tx = require('ethereumjs-tx');

// var {Registration,Userwallet,Importwallet,Tokensettings,Tokendetails,OrderDetails,RefCode,FAQ,ContactInfo} = require('../models/contact');
// const {TeamMember} = require('../model/schema/team_info');

// const {BannerInfo,GetInTouch,PartnerInfo,MediaCoverage} = require('../model/schema/home_content');
// const {POC,POCDaily,EnergyBuyer,CRate,PocInfo,UserBuyer,PocNew,PreOrder,BusinessCompany,InPounds,AdminPocBalances,EmoncmsInput,EmoncmsFeed,EmonDayFeed} = require('../model/schema/poc.js');




const Web3 = require('web3');
const web3js = new Web3(
  new Web3.providers.HttpProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  )
);

// var dateTime = require('node-datetime');

var moment = require('moment');

var { Stake, MainStake, StakeRate } = require('../models/staking');
const admin = require('../models/admin');

var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
var indiaTime = new Date(indiaTime);
var current_time = indiaTime.toLocaleString();


/****************/

routes.use(bodyParser.urlencoded({ extended: true }))
routes.use(bodyParser.json())

bcrypt.genSalt(10, (err, salt) => {

  bcrypt.hash("123456", salt, (err, hash) => {
    // console.log("----------new string ",hash)
  })
})
routes.use(session({
  secret: 'admindetails',
  resave: false,
  saveUninitialized: true
}));

routes.use(flash());

// var admindata123 = new StakeRate({
//   "interest_rate" : "0.1", "updated_at" : "Fri Nov 27 2020 12:47:17 GMT+0530 (India Standard Time)"
// });

// admindata123.save().then(success => {
//   console.log("----------- ",success);
// }).catch(err => {
//   console.log("-----------err ",err);
// })

/******For User Profile Pictrue***/

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/uploads/user_profile_images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
});
var upload = multer({ storage: storage });


/******For Admin Profile Picture***/

var storage_admin = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/admin_assets/uploads/admin_profile_images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
});

// var upload_admin = multer({storage: storage_admin});

var upload_admin = multer({
  storage: storage_admin
}).array("imgUploader", 1);


/******For Team Member Profile Picture***/

var storage_team_member = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/admin_assets/uploads/team-member-profiles')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
});

var upload_member_profile = multer({ storage: storage_team_member });


/******For News Section Picture***/

var storage_news_details = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/admin_assets/uploads/news-section')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
});

var upload_news_profile = multer({ storage: storage_news_details });


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'questtestmail@gmail.com',
    pass: 'test123R',
  }
});

routes.get('/admin-login', (req, res) => {
  let fail = req.flash('fail');
  let success_logout = req.flash('success_logout');
  res.render('admin/admin-login/admin_login.ejs', { fail, success_logout });
});

routes.post('/submit-details', async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  const email = req.body.username;
  const password = req.body.password;
  // let Admin = {
  //   name: 'Visahl',
  //   email: req.body.username,
  //   password: mystr,
  //   user_type: 'admin'
  // };

  // AdminInfo.create(Admin, function (res, err) {
  //   console.log(res)
  //   console.log(err)
  // })
  let isAdmin = await adminServices.findAdmin(email)
  if (isAdmin == 'notAdmin') {
    console.log('Admin not found')
    req.flash('fail', 'You have entered wrong email try again.');
    res.redirect('/admin-login');
  } else {
    const mystr = await userServices.createCipher(password);
    let checkPass = await adminServices.checkAdminPass(email, mystr)

    if (checkPass == 'wrongPassword') {
      req.flash('fail', 'You have entered wrong password try again.');
      res.redirect('/admin-login');
    }
    else {
      let admin = isAdmin
      //console.log(admin._id);
      console.log(`${admin.name} logged in as a admin`);
      const secret = speakeasy.generateSecret({
        length: 10,
        name: 'Rowan_Energy_Admin',
        issuer: 'Rowan_Energy_Admin'
      });
      var url = speakeasy.otpauthURL({
        secret: secret.base32,
        label: 'Rowan_Energy_Admin',
        issuer: 'Rowan_Energy_Admin',
        encoding: 'base32'
      });
      QRCode.toDataURL(url, async (err, dataURL) => {
        var secret_code = secret.base32;
        var qrcode_data = dataURL
        var user_details = { user_id: admin._id, name: admin.name };

        /******Store in session*******/

        let newSession = await adminServices.createSession(req, admin)
        var err_msg = '';
        var success_msg = '';

        res.redirect('/main-dashboard');

      })
    }
  }
})


routes.get('/main-dashboard', middleware_check_login, async (req, res) => {
  const total_orders = 0;
  const total_tokens_count = [];
  let total_users_s = await Registration.count({})
  console.log(`281-total_users_s`, total_users_s)

  const rown_bal1 = await bscHelper.coinBalanceBNB(admin_wallet) //artw balance
  console.log(`290-artw`, rown_bal1)

  const actual_balance = await ethHelper.balanceMainETH(admin_wallet) //ethereum balance
  console.log(`293-eth`, actual_balance)

  const admin_detail = await adminServices.findAdmin(req.session.re_usr_email)
  if (admin_detail != '' && admin_detail == null) {
    req.session.destroy(function (err) {
    });
    console.log("262- something went wrong please log in again")
    req.flash('fail', 'Opps! something went wrong please login again');
    res.redirect('/admin-login');
  }
  else {
    res.render('admin/admin-dashboard/front-admin/main-dashboard.ejs', {
      Name: req.session.user_name, session: req.session, profile_image: req.session.profile_image, total_orders_s: total_orders, token_balance: rown_bal1, ether_balance: actual_balance, main_rwn_vault: "0", total_users_s
    });
  }
})



routes.get('/my-profile', middleware_check_login, async (req, res) => {

  // console.log('Session Data',req.session)
  var id = req.session.user_main_id;

  if (id != '' && id != undefined) {
    let admin = await adminServices.checkAdminId(id)
    if (admin != '' && admin == null) {
      req.session.destroy(function (err) {
      });
      console.log("262- something went wrong please log in again")
      req.flash('fail', 'Opps! something went wrong please login again');
      res.redirect('/admin-login');
    }
    else {
      res.render('admin/admin-dashboard/front-admin/my-profile.ejs', { Name: req.session.user_name, name: admin.name, email: admin.email, mobile: admin.mobile, contract_address: admin.contract_address, profile_image: admin.profile_image, user_main_id: admin._id, expressFlash: req.flash() });
    }
  }
});


routes.post('/update_profile', middleware_check_login, (req, res) => {

  console.log(`299- update_profile`, req.body)

  var id = req.body.id;
  console.log('-----------', req.body);
  if (req.files != null && req.files != undefined && req.files != '') {
    var imageFile = typeof req.files.profile_image !== "undefined" ? req.files.profile_image.name : "";
  } else {
    var imageFile = '';
  }


  if (imageFile != "") {
    profile_image = imageFile;

    if (imageFile != "") {
      var imgpath = 'public/upload_admin_profile/' + imageFile;
      req.files.profile_image.mv(imgpath, function (err) {
        console.log('err', err)
      });
    }
  } else {
    profile_image = req.body.old_image;
  }
  console.log('-----------', req.body.user_name, '---------', req.body.email, '-----', req.body.mobile);
  var user_name = req.body.user_name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var profile_image = profile_image;
  var updated_at = Date.now();

  AdminInfo.update({ _id: id }, {
    $set: {
      name: user_name,
      email: email,
      mobile: mobile,
      profile_image: profile_image,
      updated_at: updated_at,
    }
  }, function (err) {
    if (err) {

      req.flash('err_msg', 'Something went wrong.');
      res.redirect('/my-profile');
    }
    else {

      req.session.user_name = req.body.user_name;
      req.session.profile_image = profile_image;
      req.session.re_usr_email = req.body.email;
      req.flash('success_msg', 'Profile updated successfully.');
      res.redirect('/my-profile');
    }
  })

});




routes.get('/change-password-front-admin', middleware_check_login, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  AdminInfo.findOne().then((succ) => {
    res.render('admin/admin-dashboard/front-admin/change-password.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, user_main_id: succ._id, err_msg, success_msg });
  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

/***************************  *Update Admin Password ******************************/

routes.post('/update-password-front-admin', middleware_check_login, (req, res) => {

  var id = req.session.user_main_id;

  var old_pass = req.body.current_password;

  var new_pass = req.body.new_password;

  var mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
  var old_pass1 = mykey1.update(old_pass, 'utf8', 'hex')
  old_pass1 += mykey1.final('hex');
  console.log("old pass ", old_pass1);
  AdminInfo.findOne({ '_id': id }, function (err, result) {
    if (err) {
      req.flash('err_msg', 'Something is worng');
      res.redirect('/change-password-front-admin');
    } else {
      var check_old_pass = result.password;
      console.log("check_old_pass ", check_old_pass);
      if (check_old_pass != old_pass1) {
        req.flash('err_msg', 'Please enter correct current password.');
        res.redirect('/change-password-front-admin');

      } else {
        var mykey2 = crypto.createCipher('aes-128-cbc', 'mypass');
        var new_pass1 = mykey2.update(new_pass, 'utf8', 'hex');
        new_pass1 += mykey2.final('hex');
        console.log("new pass ", new_pass1);


        if (check_old_pass != new_pass1) {
          // console.log(result);
          AdminInfo.updateOne({ _id: id }, { $set: { password: new_pass1 } }, function (err) {
            if (err) {
              req.flash('err_msg', 'Something went wrong.');
              res.redirect('/change-password-front-admin');
            } else {
              req.flash('success_msg', 'Password changed successfully.');
              res.redirect('/change-password-front-admin');
            }
          });
        } else {
          req.flash('err_msg', 'New password should not be same as current password.');
          res.redirect('/change-password-front-admin');
        }
      }

    }
  });

});


routes.get('/logout1', (req, res) => {
  console.log("logout")
  req.session.destroy(function (err) {
    console.log("in_logout")
  });

  req.flash('success_logout', 'You have logged out successfully.');

  res.redirect('/admin-login');
});



routes.get('/user-list', middleware_check_login, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var day = moment(new Date()).format('M/D/YYYY');
  Registration.find({ deleted: '0', created_at: { $gte: day + ', 00:00:00 AM', $lte: day + ', 12:59:59 PM' } }).sort({ _id: -1 }).lean().then(async (results) => {

    // Registration.find({deleted:'0'}).sort({_id: -1}).lean().then(async (results)=>{
    // console.log("result======== ",results);
    for (var j = 0; j < results.length; j++) {
      var allWalets = [];
      var wallets = await Userwallet.find({ user_id: results[j]._id, deleted: '0' });
      // console.log(wallets);
      wallets.forEach(wallet => {
        allWalets.push(wallet.wallet_address);
      })
      var userWallet = allWalets.join(',');
      results[j].wallet_address = userWallet;
    }
    if (results) {
      //  console.log('results',results)
      res.render('admin/admin-dashboard/front-admin/user-list.ejs', { err_msg, success_msg, expressFlash: req.flash(), user_details: results, moment, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    res.send('Something went wrong');
  }).catch((e) => {
    res.send(e);
  });
});

/******************************************************************************************/

routes.post('/userListByDate', middleware_check_login, (req, res, next) => {
  // var newDate = req.body.getDate;
  var newMinDate = req.body.getMinDate;
  var newMaxDate = req.body.getMaxDate;
  // console.log("gdfgsdcgcs--------new Date ",newDate);
  // var day = moment(new Date(newDate)).format('M/D/YYYY');
  var min = moment(new Date(newMinDate)).format('M/D/YYYY');
  var max = moment(new Date(newMaxDate)).format('M/D/YYYY');
  // console.log("------------today2 ",day);
  Registration.find({ deleted: '0', created_at: { $gte: min + ', 00:00:00 AM', $lte: max + ', 12:59:59 PM' } }).sort({ _id: -1 }).lean().then(async (results) => {
    if (results.length > 0) {
      console.log("result======== ", results);
      for (var j = 0; j < results.length; j++) {
        var allWalets = [];
        var wallets = await Userwallet.find({ user_id: results[j]._id, deleted: '0' });
        // console.log(wallets);
        wallets.forEach(wallet => {
          allWalets.push(wallet.wallet_address);
        })
        var userWallet = allWalets.join(',');
        results[j].wallet_address = userWallet;
      }
      if (results) {
        res.render('admin/admin-dashboard/front-admin/user-list.ejs', { expressFlash: req.flash(), user_details: results, moment, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image });
      }
    } else {
      res.render('admin/admin-dashboard/front-admin/user-list.ejs', { expressFlash: req.flash(), user_details: [], moment, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log("------------error ", error);
  }).catch((e) => {
    console.log("------------e ", e);
  });
})

routes.post('/searchUser', middleware_check_login, (req, res, next) => {
  var value = req.body.value;
  // var pattern = new RegExp('.*'+value+'.*', "i");
  var all_result = [];
  Registration.find({ deleted: '0', $or: [{ "name": { $regex: '.*' + value + '.*', $options: "i" } }, { "email": { $regex: '.*' + value + '.*', $options: "i" } }] }).sort({ _id: -1 }).lean().then(async (results) => {
    for (var j = 0; j < results.length; j++) {
      var allWalets = [];
      var wallets = await Userwallet.find({ user_id: results[j]._id, deleted: '0' });
      // console.log(wallets);
      wallets.forEach(wallet => {
        allWalets.push(wallet.wallet_address);
      })
      var userWallet = allWalets.join(',');
      results[j].wallet_address = userWallet;
      all_result.push(results[j]);
    }
    await Userwallet.find({ deleted: '0', "wallet_address": { $regex: '.*' + value + '.*', $options: "i" } }).then(async searchWallet => {
      console.log("................", searchWallet);
      if (searchWallet != "" && searchWallet != []) {
        for (var l = 0; l < searchWallet.length; l++) {
          var search_user_id = searchWallet[l].user_id;
          console.log("search user id1", search_user_id);
          await Registration.findOne({ deleted: '0', _id: search_user_id }).sort({ _id: -1 }).lean().then(async (results1) => {
            // console.log("results1",results1);
            // for(var k=0;k<results1.length;k++){
            console.log("search user id2", search_user_id);
            var allWalets1 = [];
            var wallets1 = await Userwallet.find({ user_id: results1._id, deleted: '0' });
            console.log("search user id3", search_user_id);
            // console.log(wallets1);
            wallets1.forEach(wallet1 => {
              allWalets1.push(wallet1.wallet_address);
              console.log("search user id4", search_user_id);
            })
            var userWallet1 = allWalets1.join(',');
            results1.wallet_address = userWallet1;
            all_result.push(results1);
          })
        }
      }
    })
    console.log("all_result5", all_result);
    res.render('admin/admin-dashboard/front-admin/user_search', { expressFlash: req.flash(), user_details: all_result, moment, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image });
    // }
  }, (error) => {
    console.log("------------error ", error);
  }).catch((e) => {
    console.log("------------e ", e);
  });

})


routes.get('/deactiveUser', adminServices.deactivateUser)

routes.get('/activeUser', adminServices.activateUser)


routes.get('/edit-user', middleware_check_login, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var user_main_id = req.query.id.trim();

  Registration.findOne({ 'email': user_main_id }).then((results) => {
    console.log("570-/edit-User", results);

    if (results) {

      res.render('admin/admin-dashboard/front-admin/change_user_password', { err_msg, success_msg, details: results, Name: req.session.user_name, profile_image: req.session.profile_image });
    }

  }, (error) => {

    res.send('Something went wrong');

  }).catch((e) => {

    res.send(e);

  });


});

routes.post('/update-password-user', (req, res) => {
  var user_id = req.body.id.trim();
  var password = req.body.new_password.trim();
  var mykey = crypto.createCipher('aes-128-cbc', 'mypass');
  var mystr = mykey.update(password, 'utf8', 'hex')
  mystr += mykey.final('hex');
  console.log('string', mystr)
  console.log('string', user_id)
  Registration.updateOne({ '_id': user_id }, { $set: { 'password': mystr } }, { upsert: true }, function (err, result) {
    console.log("updatedddddddddddd");
    if (err) { console.log(err); }
    else {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'info.artwtoken@gmail.com',
          pass: 'Art@!#W396'
        }
      });
      const mailOptions = {
        to: req.body.email,
        from: 'info.artwtoken@gmail.com',
        subject: 'Forgot Password',

        text: 'Dear Customer,' + '\n\n' + 'New Password form ARTW.\n\n' +
          'Password: ' + password + '\n http://' + req.headers.host + '/' + '\n\n' +

          'We suggest you to please change your password after successfully logging in on the portal using the above password :\n\n' +

          'Here is the change password link: http://' + req.headers.host + '/Profile' + '\n\n' +
          'Thanks and Regards,' + '\n' + 'ARTW Team' + '\n\n',
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log(err);
      });
      req.flash('success_msg', 'Password has been changed successfully.');
      res.redirect('/user-list');
    }
  })
})

/******************************************************************************************/



routes.get('/send-token', middleware_check_login, async (req, res) => {
  var email = req.session.re_usr_email;

  const admin_detail = await adminServices.findAdmin(email)
  if (admin_detail != '' && admin_detail == null) {
    req.session.destroy(function (err) {
    });
    console.log("262- something went wrong please log in again")
    req.flash('fail', 'Opps! something went wrong please login again');
    res.redirect('/admin-login');
  }
  else {
    succ = admin_detail
    console.log(`655-succ`, "succ")
    let id = req.query.id;
    console.log("657-id", id)
    const sender_address = admin_wallet;
    if (id && id != "" && id != undefined) {
      //console.log("660-in if")
      await OrderDetails.findOne({ _id: id }).then(async result => {
        console.log(`660-result`, result)
        var reciever_address = result.rwn_wallet_address;
        var amount = result.rwn_count;
        var user_id = result.user_id;
        await RefCode.findOne({ user_id: user_id, status: "Not used" }).then(async ref => {
          console.log("665-refResult", ref);
          if (ref != null) {
            var refID = ref._id;
            var reg_code = ref.reg_ref_code;
            await Registration.findOne({ ref_code: reg_code }).then(async bonusUser => {
              var bonusUserId = bonusUser._id;
              await Importwallet.findOne({ 'user_id': bonusUserId, 'login_status': 'login' }).then(async loginwallet => {
                if (loginwallet != "" && loginwallet != null && loginwallet != undefined) {
                  await Userwallet.findOne({ '_id': loginwallet.wallet_id })
                    .then(async bonususerAdd => {
                      var bonusAmount = (amount / 100) * 3;
                      var bonusWalletAddress = bonususerAdd.wallet_address;
                      res.render('admin/admin-dashboard/front-admin/send-token.ejs', { sender_address, id, Name: req.session.user_name, profile_image: req.session.profile_image, amount, bonusAmount, bonusWalletAddress, refID, user_id, reciever_address, user_main_id: succ._id, expressFlash: req.flash() });
                    }).catch(err => { })
                } else {
                  await Userwallet.findOne({ user_id: bonusUserId, status: "active" })
                    .then(async bonususerAdd => {
                      var bonusAmount = (amount / 100) * 3;
                      var bonusWalletAddress = bonususerAdd.wallet_address;
                      res.render('admin/admin-dashboard/front-admin/send-token.ejs', { sender_address, id, Name: req.session.user_name, profile_image: req.session.profile_image, amount, bonusAmount, bonusWalletAddress, refID, user_id, reciever_address, user_main_id: succ._id, expressFlash: req.flash() });
                    }).catch(err => { })
                }
              }).catch(err => { })
            })
              .catch(err => { })

          } else {
            var refID = "";
            var bonusAmount = "";
            var bonusWalletAddress = "";
            res.render('admin/admin-dashboard/front-admin/send-token.ejs', { sender_address, id, Name: req.session.user_name, profile_image: req.session.profile_image, amount, bonusAmount, bonusWalletAddress, refID, user_id, reciever_address, user_main_id: succ._id, expressFlash: req.flash() });
          }
        })

      })
        .catch(err => {
        })
    } else {

      //console.log("711-in else")
      let reciever_address = "";
      let amount = "";
      let refID = "";
      var bonusAmount = "";
      var bonusWalletAddress = "";
      id = "";
      let user_id = "";
      res.render('admin/admin-dashboard/front-admin/send-token.ejs', { sender_address, id, Name: req.session.user_name, profile_image: req.session.profile_image, amount, bonusAmount, bonusWalletAddress, refID, user_id, reciever_address, user_main_id: succ._id, expressFlash: req.flash() });
    }
  }


});


routes.post('/submit-token', async (req, res, next) => {
  var orderId = req.body.orderId.trim();
  var user_id = req.body.user_id.trim();

  var bonusWalletAddress = req.body.bonusAddress.trim();
  var bonusAmount = req.body.bonusamount.trim();
  var refID = req.body.refID.trim();
  var entered_passphrese = req.body.enter_passphrase.trim();
  var sender_private_key;

  var sender_address = req.body.sender_address.trim();
  var reciver_address = req.body.reciver_address.trim();
  var get_amount = req.body.amount_send.trim();
  var email = req.session.re_usr_email;
  AdminInfo.findOne({ "email": email }).then(async (succ) => {
    if (succ.user_type == "manager") {
      var entered_passphrese1 = crypto.createHash('sha256').update(entered_passphrese).digest('base64');
      var matching_pass = succ.passphrase;

      if (entered_passphrese1 == matching_pass) {
        var options4 = {
          url: "http://3.137.11.222:8502",
          method: 'POST',
          headers:
          {
            "content-type": "application/json"
          },

          body: JSON.stringify({ "jsonrpc": "2.0", "method": "personal_listWallets", "params": [], "id": 1 })
        };
        await request(options4, async function (error, response, body) {

          var c = JSON.parse(body).result;
          console.log("c.length ", c.length);
          c.forEach(function (element) {

            var accounts_details = element.accounts;
            accounts_details.forEach(async function (element1) {

              if (element1.address == sender_address) {

                var parts = element1.url.split('/');
                var lastSegment = parts.pop() || parts.pop();
                console.log("lastSegment", lastSegment);

                var options6 = {
                  url: `http://3.137.11.222/devnetwork/node2/keystore/${lastSegment}`,
                  method: 'GET',
                  headers: {
                    "content-type": "application/json"
                  }
                }
                await request(options6, async function (error, response, body) {
                  console.log("error", error);
                  console.log("body", body);

                  if (!error && response.statusCode == 200) {
                    var csv = body;
                    console.log(csv)
                    var c = web3js.eth.accounts.decrypt(csv, entered_passphrese);
                    console.log(c.privateKey);
                    var pk = c.privateKey.slice(2);
                    sender_private_key = pk;
                    var privateKey = Buffer.from(sender_private_key, 'hex');
                    console.log("private key", privateKey);
                    var options = {
                      url: "http://3.137.11.222:8502",
                      method: 'POST',
                      headers:
                      {
                        "content-type": "application/json"
                      },
                      body: JSON.stringify({ "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [sender_address, entered_passphrese], "id": 1 })
                    };
                    await request(options, function (error, response, body) {
                      console.log("----------", error);
                      if (!error && response.statusCode == 200) {
                        console.log(body);



                        var options = {
                          url: "http://3.137.11.222:8502",
                          method: 'POST',
                          headers:
                          {
                            "content-type": "application/json"
                          },
                          body: JSON.stringify({ "jsonrpc": "2.0", "method": "clique_getSigners", "params": [], "id": 1 })
                        };
                        request(options, function (error5, response5, body5) {
                          if (!error5 && response5.statusCode == 200) {
                            var validators = JSON.parse(body5);
                            var all_validators = validators.result;

                            console.log("inside" + all_validators);
                            var user1 = tokenContractABI;
                            var tokenContract = new web3js.eth.Contract(user1, "0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                            var count;
                            var array_donation = [];

                            tokenContract.methods.balanceOf(sender_address).call().then(function (result) {
                              // console.log(result);
                              var count_balance = parseInt(result);
                              rown_bal = count_balance / Math.pow(10, 7);
                              console.log(rown_bal);
                              if (rown_bal >= get_amount) {
                                web3js.eth.getTransactionCount(sender_address).then(ex => {
                                  console.log("exxxxxxxxxxxx", ex);
                                })

                                web3js.eth.getTransactionCount(sender_address).then(function (v) {
                                  console.log("Count: " + v);
                                  count = v;
                                  console.log("Count: " + count);
                                  var amount = Math.round(get_amount * 100) / 100;

                                  var rawTransaction = {
                                    "from": sender_address,
                                    "gasPrice": '0x0',
                                    "gasLimit": web3js.utils.toHex(4600000),
                                    "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
                                    "value": "0x0",
                                    "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7), array_donation, '0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
                                    "nonce": web3js.utils.toHex(count)
                                  }

                                  var transaction = new Tx(rawTransaction);
                                  transaction.sign(privateKey);
                                  web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
                                    console.log("errrrrrrrrrrrrrrrrrrrr", err);
                                    if (hash != "" && hash != null && hash != undefined) {


                                      var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
                                      var indiaTime = new Date(indiaTime);
                                      var created_at = indiaTime.toLocaleString();

                                      Tokendetails.count(function (err, respcount) {
                                        var count_val = parseFloat(respcount) + parseFloat(1);

                                        var TokendetailsData = new Tokendetails({

                                          auto: count_val,
                                          sender_wallet_address: sender_address,
                                          receiver_wallet_address: reciver_address,
                                          hash: hash,
                                          amount: get_amount,
                                          payment_status: 'pending',
                                          created_at: created_at,
                                          status: 'active',
                                          token_type: 'ARTW',
                                          transaction_type: 'Send'

                                        });
                                        TokendetailsData.save(function (err, doc) {
                                          if (err) {
                                            console.log('token data is not save.');
                                          } else {




                                            /******Store in session*******/
                                            var err_msg = '';
                                            var success_msg = '';

                                            // res.render('admin/admin-dashboard/verify-payment',{
                                            // err_msg,success_msg,secret_code,dataURL,count,bonusWalletAddress,result,bonusAmount,sender_address,user_id,refID,orderId
                                            // });
                                            if (bonusWalletAddress != "") {
                                              console.log("referral", bonusWalletAddress);
                                              setTimeout(function () {
                                                res.redirect(`/referral?bonusWalletAddress=${bonusWalletAddress}&result=${result}&bonusAmount=${bonusAmount}&sender_address=${sender_address}&user_id=${user_id}&refID=${refID}&orderId=${orderId}`);
                                              }, 15000);

                                            } else {
                                              if (orderId) {



                                                OrderDetails.updateOne({ '_id': orderId }, { $set: { 'payment_status': 'Paid' } }, function (err, result1) {
                                                  if (err) { console.log(err); }
                                                  else {
                                                    req.flash('success', 'Your transaction in done.');
                                                    res.redirect('/artw-token-history');
                                                  }
                                                });
                                              } else {
                                                req.flash('success', 'Your transaction in done.');
                                                res.redirect('/artw-token-history');
                                              }

                                            }
                                          }
                                        });
                                      });
                                    }

                                    else {
                                      req.flash('fail', "Insufficient funds In Your account.1");
                                      res.redirect('send-token');

                                    }
                                  })
                                });
                              }
                              else {
                                req.flash('fail', "Insufficient funds In Your account.2");
                                res.redirect('send-token');
                              }
                            });

                          }
                        });

                      }
                      else {
                        res.write(response.statusCode.toString() + " " + error);
                      }
                    });

                  }
                })
              }
            });
          });
        });
      } else {
        req.flash('fail', 'Please enter valid passphrase.');
        res.redirect('send-token');
      }
    } else {
      var entered_passphrese1 = entered_passphrese;
      var matching_pass = 'Pass@ArtW_node1';
      sender_private_key = '0de3838ca99bd85255bc630733f7d72484508cc3a8cd9c03a59d6d97aa9bf83b';
      var privateKey = Buffer.from(sender_private_key, 'hex');
      if (entered_passphrese1 == matching_pass) {

        console.log("private key", privateKey);
        var options = {
          url: "http://3.137.11.222:8502",
          method: 'POST',
          headers:
          {
            "content-type": "application/json"
          },
          body: JSON.stringify({ "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [sender_address, entered_passphrese], "id": 1 })
        };
        await request(options, function (error, response, body) {
          console.log("----------", error);
          if (!error && response.statusCode == 200) {
            console.log(body);



            var options = {
              url: "http://3.137.11.222:8502",
              method: 'POST',
              headers:
              {
                "content-type": "application/json"
              },
              body: JSON.stringify({ "jsonrpc": "2.0", "method": "clique_getSigners", "params": [], "id": 1 })
            };
            request(options, function (error5, response5, body5) {
              if (!error5 && response5.statusCode == 200) {
                var validators = JSON.parse(body5);
                var all_validators = validators.result;

                console.log("inside" + all_validators);





                var user1 = tokenContractABI;
                var tokenContract = new web3js.eth.Contract(user1, "0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                var count;
                var array_donation = [];

                tokenContract.methods.balanceOf(sender_address).call().then(function (result) {
                  // console.log(result);
                  var count_balance = parseInt(result);
                  rown_bal = count_balance / Math.pow(10, 7);
                  console.log(rown_bal);
                  if (rown_bal >= get_amount) {
                    web3js.eth.getTransactionCount(sender_address).then(ex => {
                      console.log("exxxxxxxxxxxx", ex);
                    })

                    web3js.eth.getTransactionCount(sender_address).then(function (v) {
                      console.log("Count: " + v);
                      count = v;
                      console.log("Count: " + count);
                      var amount = Math.round(get_amount * 100) / 100;

                      var rawTransaction = {
                        "from": sender_address,
                        "gasPrice": '0x0',
                        "gasLimit": web3js.utils.toHex(4600000),
                        "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
                        "value": "0x0",
                        "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7), array_donation, '0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
                        "nonce": web3js.utils.toHex(count)
                      }

                      var transaction = new Tx(rawTransaction);
                      transaction.sign(privateKey);
                      web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
                        console.log("errrrrrrrrrrrrrrrrrrrr", err);
                        if (hash != "" && hash != null && hash != undefined) {


                          var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
                          var indiaTime = new Date(indiaTime);
                          var created_at = indiaTime.toLocaleString();

                          Tokendetails.count(function (err, respcount) {
                            var count_val = parseFloat(respcount) + parseFloat(1);

                            var TokendetailsData = new Tokendetails({

                              auto: count_val,
                              sender_wallet_address: sender_address,
                              receiver_wallet_address: reciver_address,
                              hash: hash,
                              amount: get_amount,
                              payment_status: 'pending',
                              created_at: created_at,
                              status: 'active',
                              token_type: 'ARTW',
                              transaction_type: 'Send'

                            });
                            TokendetailsData.save(function (err, doc) {
                              if (err) {
                                console.log('token data is not save.');
                              } else {






                                /******Store in session*******/
                                var err_msg = '';
                                var success_msg = '';

                                // res.render('admin/admin-dashboard/verify-payment',{
                                // err_msg,success_msg,secret_code,dataURL,count,bonusWalletAddress,result,bonusAmount,sender_address,user_id,refID,orderId
                                // });
                                if (bonusWalletAddress != "") {
                                  setTimeout(function () {
                                    res.redirect(`/referral?bonusWalletAddress=${bonusWalletAddress}&result=${result}&bonusAmount=${bonusAmount}&sender_address=${sender_address}&user_id=${user_id}&refID=${refID}&orderId=${orderId}`);
                                  }, 15000);
                                } else {
                                  if (orderId) {



                                    OrderDetails.updateOne({ '_id': orderId }, { $set: { 'payment_status': 'Paid' } }, function (err, result1) {
                                      if (err) { console.log(err); }
                                      else {
                                        req.flash('success', 'Your transaction in done.');
                                        res.redirect('/artw-token-history');
                                      }
                                    });
                                  } else {
                                    req.flash('success', 'Your transaction in done.');
                                    res.redirect('/artw-token-history');
                                  }
                                }
                              }
                            });
                          });
                        }

                        else {
                          req.flash('fail', "Insufficient funds In Your account.1");
                          res.redirect('send-token');

                        }
                      })
                    });
                  }
                  else {
                    req.flash('fail', "Insufficient funds In Your account.2");
                    res.redirect('send-token');
                  }
                });

              }
            });

          }
          else {
            res.write(response.statusCode.toString() + " " + error);
          }
        });
      }
      else {
        req.flash('fail', 'Please enter valid passphrase.');
        res.redirect('send-token');
      }
    }


  });
})


routes.get('/referral', (req, res, next) => {
  var array_donation = [];
  // var created_at = new Date();
  var bonusWalletAddress = req.query.bonusWalletAddress;
  var result = req.query.result;
  var count = req.query.count;
  var bonusAmount = req.query.bonusAmount;
  var sender_address = req.query.sender_address;
  var user_id = req.query.user_id;
  var orderId = req.query.orderId;
  var sender_private_key = '0de3838ca99bd85255bc630733f7d72484508cc3a8cd9c03a59d6d97aa9bf83b';
  var privateKey = Buffer.from(sender_private_key, 'hex');

  var refID = req.query.refID;
  var user1 = tokenContractABI;
  var tokenContract = new web3js.eth.Contract(user1, "0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
  // if(bonusWalletAddress!=""){
  var count_balance1 = parseInt(result);
  rown_bal1 = count_balance1 / Math.pow(10, 7);
  console.log(rown_bal1);
  if (rown_bal1 >= bonusAmount) {
    web3js.eth.getTransactionCount(sender_address).then(function (w) {
      console.log("Count: " + w);
      // console.log("Count+1: ", parseInt(w)+1);
      countw = w; //parseInt(w)+1;
      var amounts = Math.round(bonusAmount * 100) / 100;
      var rawTransactions = {
        "from": sender_address,
        "gasPrice": '0x0',
        "gasLimit": web3js.utils.toHex(4600000),
        "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
        "value": "0x0",
        "data": tokenContract.methods.transferAndDonateTo(bonusWalletAddress, amounts * Math.pow(10, 7), array_donation, '0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
        "nonce": web3js.utils.toHex(countw)
      }
      // console.log(rawTransaction);
      var transactions = new Tx(rawTransactions);
      transactions.sign(privateKey);
      web3js.eth.sendSignedTransaction('0x' + transactions.serialize().toString('hex'), (errr, hashs) => {
        console.log("transaction hashhhhhh", hashs);
        console.log("transaction error", errr);
        if (hashs != "" && hashs != null && hashs != undefined) {
          RefCode.updateOne({ '_id': refID }, { $set: { 'status': 'Used' } }, { upsert: true }, function (err, result) {
            if (err) { console.log(err); }
            else {
              OrderDetails.updateOne({ '_id': orderId }, { $set: { 'payment_status': 'Paid' } }, { upsert: true }, function (err, result) {
                if (err) { console.log(err); }
                else {
                  Registration.findOne({ "_id": user_id }).then(bonusUser => {
                    Tokendetails.count(function (err, respcounts) {
                      var count_vals = parseFloat(respcounts) + parseFloat(1);
                      var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
                      var indiaTime = new Date(indiaTime);
                      var created_at = indiaTime.toLocaleString();
                      var TokendetailsDatas = new Tokendetails({
                        auto: count_vals,
                        sender_wallet_address: sender_address,
                        receiver_wallet_address: bonusWalletAddress,
                        hash: hashs,
                        amount: amounts,
                        payment_status: 'pending',
                        created_at: created_at,
                        status: 'active',
                        token_type: 'ARTW',
                        transaction_type: 'Send',
                        referred_to_name: bonusUser.name,
                        referred_to_email: bonusUser.email,
                        bonus_reward: 'Yes'
                      });
                      TokendetailsDatas.save(function (err, doc) {
                        if (err) {
                          console.log('token data is not saved.');
                        } else {
                          req.flash('success', 'Your transaction in done.');
                          res.redirect('/artw-token-history');
                        }
                      })
                    })
                  })
                }
              })
            }
          });
        }
      })
    })
  }
})


/*****************Rowan token history****************/
routes.get('/artw-token-history', middleware_check_login, (req, res) => {
  AdminInfo.findOne({ email: req.session.re_usr_email }).then(admin_info => {
    if (admin_info.user_type == "admin") {
      Tokendetails.find({ deleted: '0' }).sort([['auto', -1]]).then((success_response) => {

        res.render('admin/admin-dashboard/front-admin/artw_token_history', { Name: req.session.user_name, profile_image: req.session.profile_image, ether_data: success_response });

      }, (err) => {
        res.send('something went wrong try again');

      }).catch((e) => {
        res.send('something went wrong try again');

      });
    } else {
      var wallet_address = admin_info.user_wallet;
      Tokendetails.find({ deleted: '0', $or: [{ sender_wallet_address: wallet_address }, { receiver_wallet_address: wallet_address }] }).sort([['auto', -1]]).then((success_response) => {

        res.render('admin/admin-dashboard/front-admin/artw_token_history', { Name: req.session.user_name, profile_image: req.session.profile_image, ether_data: success_response });

      }, (err) => {
        res.send('something went wrong try again');

      }).catch((e) => {
        res.send('something went wrong try again');

      });
    }

  })


  Tokendetails.find({ 'payment_status': 'pending' }, function (err, response) {
    if (response != "" && response != null && response != undefined) {
      for (var i = 0; i < response.length; i++) {
        console.log(response.length);
        check_tx_status(response[i].hash, response[i]._id, function (err, respo) {
          console.log(respo);
        });
      }
    } else {
      console.log('no record found.');
    }

  });


  //////////////////////////////

  function check_tx_status(tx_hash, tx_id, callback) {
    web3js.eth.getTransactionReceipt(tx_hash).then(async send_resu => {
      console.log("======================================== " + send_resu);
      if (send_resu != null && send_resu != "" && send_resu != undefined) {
        await Tokendetails.updateOne({ '_id': tx_id }, { $set: { 'payment_status': 'paid' } }, { upsert: true }, async function (err, result) {
          if (err) { console.log(err); }
          else {
            return await callback(null, 'tx success');
          }
        });
      }
      else {
        return await callback(null, 'tx pending.');
      }
    })
      .catch(async err => {
        return await callback(null, err);
      })
  }

});

routes.get('/token_details', middleware_check_login, async (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  await Tokensettings.findOne().then(async result => {
    console.log("result-------", result);
    let artw_bal = await bscHelper.coinBalanceBNB(admin_wallet)
    res.render('admin/admin-dashboard/front-admin/update-token-settings', {
      err_msg, success_msg, layout: false, session: req.session, Name: req.session.user_name, profile_image: req.session.profile_image, result, actual_balance: artw_bal
    })

  })
    .catch(err => {
      console.log(err);
    })
})

routes.post('/update-token-details', middleware_check_login, (req, res) => {
  console.log("req.body------------- ", req.body);
  var id = req.body.edit_id.trim();
  var token_name = req.body.token_name;
  var total_quantity = req.body.total_quantity;
  var etherValue = req.body.ether_value;
  var btcValue = req.body.btc_value;
  var usdValue = req.body.USD_value;

  Tokensettings.updateOne({ '_id': id }, {
    $set: {
      'token_name': token_name,
      'total_quantity': total_quantity,
      'etherValue': etherValue,
      'btcValue': btcValue,
      'usdValue': usdValue
    }
  }, { upsert: true }, function (err, result1) {
    if (err) {
      console.log(err);
      req.flash('err_msg', "Please try again.");
      res.redirect('/token_details');
    }
    else {
      console.log("saved", result1);
      req.flash('success_msg', "Settings updated successfully.");
      res.redirect('/token_details');
    }
  })


})


routes.get('/BTC-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "BTC" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    console.log(results);
    if (results) {
      res.render('admin/admin-dashboard/front-admin/BTC-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/ETH-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "ETH" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    if (results) {
      res.render('admin/admin-dashboard/front-admin/ETH-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/XRP-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "XRP" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    console.log(results);
    if (results) {
      res.render('admin/admin-dashboard/front-admin/XRP-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/LTC-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "LTC" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    console.log(results);
    if (results) {
      res.render('admin/admin-dashboard/front-admin/LTC-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/DASH-OrderList', middleware_check_login, (req, res) => {
  OrderDetails.find({ payment_type: "DASH" }).populate({ path: "user_id" }).sort({ _id: -1 }).then((results) => {
    console.log(results);
    if (results) {
      res.render('admin/admin-dashboard/front-admin/DASH-order-list', { expressFlash: req.flash(), user_details: results, moment, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }, (error) => {
    console.log(error);
  }).catch((e) => {
  });
});


routes.get('/cancelBTC', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/BTC-OrderList');
    }
  })
})

routes.get('/cancelETH', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/ETH-OrderList');
    }
  })
})

routes.get('/cancelXRP', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/XRP-OrderList');
    }
  })
})

routes.get('/cancelLTC', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/LTC-OrderList');
    }
  })
})

routes.get('/cancelDASH', middleware_check_login, (req, res, next) => {
  var id = req.query.id;
  OrderDetails.update({ _id: id }, {
    $set: {
      payment_status: 'Cancelled'
    }
  }, { upsert: true }, function (err) {
    if (err) {
    }
    else {
      res.redirect('/DASH-OrderList');
    }
  })
})


routes.get('/stakes-list', middleware_check_login, async (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  var stakes = [];
  await MainStake.find({}).sort({ _id: -1 }).then(async (success_response) => {
    if (success_response) {
      for (var i = 0; i < success_response.length; i++) {
        await Registration.findOne({ _id: success_response[i].user_id }).then(async user => {
          await Stake.find({ m_stake_id: success_response[i]._id }).sort({ _id: -1 }).lean().then((vault_list) => {
            for (var j = 0; j < vault_list.length; j++) {
              vault_list[j].email = user.email;
              stakes.push(vault_list[j]);
            }
          })
        })
      }
      console.log("stakes ", stakes);
      res.render('admin/admin-dashboard/front-admin/stake-list', { err_msg, success_msg, expressFlash: req.flash(), stakes: stakes, Name: req.session.user_name, profile_image: req.session.profile_image });
    }
  }).catch((e) => {
    res.send('Something went wrong try again');
  });

});

routes.get('/set-stake', middleware_check_login, (req, res) => {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  StakeRate.findOne().then((SetVaultData) => {
    console.log('SetVaultData', SetVaultData)

    res.render('admin/admin-dashboard/front-admin/set-stake.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), SetVaultData });

  }, (err) => {
    ssss

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

});


routes.post('/update_set_stake', middleware_check_login, (req, res) => {

  var vaultrate = req.body.vaultrate;
  var id = req.body.id;
  var updated_at = new Date();

  StakeRate.update({ _id: id }, {
    $set: {
      interest_rate: vaultrate,
      updated_at: updated_at,
    }
  }, { upsert: true }, function (err) {
    if (err) {
      req.flash('err_msg', 'Something went wrong.');
      res.redirect('/set-stake');
    }
    else {
      req.flash('success_msg', 'Stake rate updated successfully.');
      res.redirect('/set-stake');
    }
  })
});



/********************************* Home Banner   ****************************/

routes.get('/home-banner-details', middleware_check_login, (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');

  // session: req.session
  console.log('req.session', req.session)

  // AdminInfo.findOne().then((succ)=>{
  BannerInfo.find({ deleted: '0' }).then((BannerData) => {

    res.render('admin/admin-dashboard/front-admin/home-banner-details.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), BannerData });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
  // });
});

/************************** banner**************************************/


routes.get('/add-new-banner', middleware_check_login, (req, res) => {

  AdminInfo.findOne().then((succ) => {

    res.render('admin/admin-dashboard/front-admin/add-new-banner.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, user_main_id: succ._id, session: req.session, expressFlash: req.flash() });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

/********************************************* Add Banner ***************************/

routes.post('/add_banner', middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var imageFile = typeof files.banner_image !== "undefined" ? files.banner_image.name : "";
    if (imageFile != "") {
      banner_image = imageFile;

      if (imageFile != "") {


        var imgpath = 'public/home/banner/' + imageFile;
        let testFile = fs.readFileSync(files.banner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      banner_image = "";
    }

    var title = fields.title;
    var content = fields.content;
    var status = fields.status;
    var created_at = Date.now();


    var BannerData = new BannerInfo({
      title: title, content: content, banner_image: banner_image, status: status, created_at: created_at
    });

    BannerData.save().then(result => {
      console.log('data added', result);
      req.flash('success_msg', 'Banner added successfully.');
      res.redirect('/home-banner-details');
    })
      .catch(err => {
        console.log(err);
      })

  });
});

/**************ad banner end************/

routes.get('/edit-banner', middleware_check_login, (req, res) => {

  var banner_id = req.query.id;

  BannerInfo.findOne({ _id: banner_id, deleted: '0' }).then((BannerDetail) => {
    console.log('BannerDetail', BannerDetail);

    res.render('admin/admin-dashboard/front-admin/edit-banner.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), BannerDetail });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

/******** Home Banner  end *********/

/************************** Update banner**************************************/

routes.post('/update_banner', middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {

    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.banner_image !== "undefined" ? files.banner_image.name : "";
    } else {
      var imageFile = '';
    }
    if (imageFile != "") {
      banner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/banner/' + imageFile;
        let testFile = fs.readFileSync(files.banner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      banner_image = fields.old_image;
    }

    var title = fields.title;
    var content = fields.content;
    var status = fields.status;
    var banner_id = fields.banner_id;
    var updated_at = Date.now();

    BannerInfo.update({ _id: banner_id }, {
      $set: {
        title: title,
        banner_image: banner_image,
        content: content,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {

        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/home-banner-details');
      }
      else {
        req.flash('success_msg', 'Banner updated successfully.');
        res.redirect('/home-banner-details');
      }
    })
  })

});


/************************** Update banner**************************************/

routes.get('/delete-banner', middleware_check_login, (req, res) => {

  var current_time = Date.now();

  var banner_id = req.query.id;

  BannerInfo.findByIdAndUpdate(banner_id, { $set: { deleted: '1', updated_at: current_time } }, { new: true }).then((success) => {

    if (success) {

      req.flash('success_msg', 'Banner deleted successfully.');

      res.redirect('/home-banner-details');
    }

  }, (error) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/home-banner-details');

  }).catch((e) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/home-banner-details');
  });

});

// ***************************************************************************************//



routes.get('/site-info', middleware_check_login, (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  // /dummy insert/ 
  // var AboutusData = new GetInTouch({ title:'IEO : Financials',address:'hello',email:'a@a.com',phone:'343434',facebook:"weff",twitter:"iuhu"});

  //  AboutusData.save().then(result =>{
  //    console.log('data added',result);

  //  })
  //  .catch(err =>{
  //    console.log(err);
  //  })
  // /dummy insert/ 
  GetInTouch.findOne({ deleted: '0' }).then((Data) => {

    res.render('admin/admin-dashboard/front-admin/site-info.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), Data });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });

});



/********************************************* Add Key ***************************/

routes.post('/update_siteinfo', middleware_check_login, (req, res) => {

  console.log("----------------update ", req.body);

  var title = req.body.title;
  var address = req.body.address;
  var email = req.body.email;
  var phone = req.body.phone;
  var facebook = req.body.facebook;
  var twitter = req.body.twitter;
  var youtube = req.body.youtube;
  var instagram = req.body.instagram;

  var id = req.body.id;
  var updated_at = Date.now();

  GetInTouch.updateOne({ _id: id }, {
    $set: {
      title: title,
      address: address,
      phone: phone,
      email: email,
      facebook: facebook,
      twitter: twitter,
      youtube: youtube,
      instagram: instagram,
      updated_at: updated_at,
    }
  }, function (err) {
    if (err) {

      req.flash('err_msg', 'Something went wrong.');
      res.redirect('/site-info');
    }
    else {
      req.flash('success_msg', 'Content updated successfully.');
      res.redirect('/site-info');
    }
  })


});



/******************************OUR PARTNER****************************************/

routes.get('/partner-list', middleware_check_login, (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');


  PartnerInfo.find({ deleted: '0' }).then((PartnerData) => {

    res.render('admin/admin-dashboard/front-admin/partner-list.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), PartnerData });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
  // });
});

/************************** PARTNER**************************************/


routes.get('/add-new-partner', middleware_check_login, (req, res) => {

  res.render('admin/admin-dashboard/front-admin/add-new-partner.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() });


});

/********************************************* Add PARTNER ***************************/

routes.post('/add_partner', middleware_check_login, (req, res) => {
  // console.log("---------------------- ",req.body," ",req.files);
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.partner_image !== "undefined" ? files.partner_image.name : "";
    } else {
      var imageFile = '';
    }

    if (imageFile != "") {
      partner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/partner/' + imageFile;
        let testFile = fs.readFileSync(files.partner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });

      }
    } else {
      partner_image = fields.old_image;
    }


    var title = fields.title;
    var url = fields.url;
    var status = fields.status;
    var created_at = Date.now();


    var PartnerData = new PartnerInfo({
      title: title, url: url, partner_image: partner_image, status: status, created_at: created_at
    });

    PartnerData.save().then(result => {
      console.log('data added', result);
      req.flash('success_msg', 'Partner added successfully.');
      res.redirect('/partner-list');
    })
      .catch(err => {
        console.log(err);
      })
  })

});

/**************add PARTNER end************/

routes.get('/edit-partner', middleware_check_login, (req, res) => {

  var id = req.query.id;

  PartnerInfo.findOne({ _id: id, deleted: '0' }).then((PartnerDetail) => {

    res.render('admin/admin-dashboard/front-admin/edit-partner.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), PartnerDetail });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

/******** Home PARTNER  end *********/

/************************** Update PARTNER**************************************/

routes.post('/update_partner', middleware_check_login, (req, res) => {
  // console.log("---------------------- ",req.body," ",req.files);
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.partner_image !== "undefined" ? files.partner_image.name : "";
    } else {
      var imageFile = '';
    }

    if (imageFile != "") {
      partner_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/partner/' + imageFile;
        let testFile = fs.readFileSync(files.partner_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      partner_image = fields.old_image;
    }


    var title = fields.title;
    var url = fields.url;
    var status = fields.status;
    var id = fields.id;
    var updated_at = Date.now();

    PartnerInfo.update({ _id: id }, {
      $set: {
        title: title,
        url: url,
        partner_image: partner_image,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {

        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/partner-list');
      }
      else {
        req.flash('success_msg', 'Partner updated successfully.');
        res.redirect('/partner-list');
      }
    })
  })

});


/************************** Update PARTNER**************************************/

routes.get('/delete-partner', middleware_check_login, (req, res) => {

  var current_time = Date.now();

  var id = req.query.id;

  PartnerInfo.findByIdAndUpdate(id, { $set: { deleted: '1', updated_at: current_time } }, { new: true }).then((success) => {

    if (success) {

      req.flash('success_msg', 'Partner deleted successfully.');

      res.redirect('/partner-list');
    }

  }, (error) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/partner-list');

  }).catch((e) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/partner-list');
  });

});


/******************************OUR TEAM****************************************/
/***************************************************************************************/



routes.get('/our-team', middleware_check_login, (req, res) => {

  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');


  TeamMember.find({ deleted: '0' }).then((TeamData) => {
    // BannerInfo.find({deleted:'0'}).then((TeamData)=>{


    res.render('admin/admin-dashboard/front-admin/our-team.ejs', { err_msg, success_msg, Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), TeamData });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
  // });
});

/************************** TEAM**************************************/


routes.get('/add-new-member', middleware_check_login, (req, res) => {

  res.render('admin/admin-dashboard/front-admin/add-new-member.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash() });

});

routes.post('/add_member', middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.member_image !== "undefined" ? files.member_image.name : "";
    } else {
      var imageFile = '';
    }

    if (imageFile != "") {
      member_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/team/' + imageFile;
        let testFile = fs.readFileSync(files.member_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      member_image = "";
    }

    var name = fields.name;
    var designation = fields.designation;
    var content = fields.content;
    var linkedin_url = fields.linkedin_url;
    var member_image = member_image;
    var status = fields.status;
    var created_at = Date.now();


    var TeamData = new TeamMember({
      name: name, designation: designation, content: content, linkedin_url: linkedin_url, member_image: member_image, status: status, created_at: created_at
    });

    TeamData.save().then(result => {

      req.flash('success_msg', 'Member added successfully.');
      res.redirect('/our-team');
    })
      .catch(err => {
        console.log(err);
      })
  })
});

/**************add TEAM end************/

routes.get('/edit-member', middleware_check_login, (req, res) => {

  var member_id = req.query.id;

  TeamMember.findOne({ _id: member_id, deleted: '0' }).then((MemberDetail) => {

    res.render('admin/admin-dashboard/front-admin/edit-member.ejs', { Name: req.session.user_name, profile_image: req.session.profile_image, session: req.session, expressFlash: req.flash(), MemberDetail });

  }, (err) => {

    res.send('Some thing went wrong try again.');

  }).catch((e) => {

    res.send('Some thing went wrong try again.');

  });
});

/********  TEAM  end *********/

/************************** Update TEAM**************************************/

routes.post('/update_member', middleware_check_login, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    var member_id = fields.id;

    if (files != null && files != undefined && files != '') {
      var imageFile = typeof files.member_image !== "undefined" ? files.member_image.name : "";
    } else {
      var imageFile = '';
    }


    if (imageFile != "") {
      member_image = imageFile;

      if (imageFile != "") {
        var imgpath = 'public/home/team/' + imageFile;
        let testFile = fs.readFileSync(files.member_image.path);
        let testBuffer = new Buffer(testFile);
        fs.writeFile(imgpath, testBuffer, function (err) {
          if (err) return console.log(err);
        });
      }
    } else {
      member_image = fields.old_image;
    }

    var name = fields.name;
    var designation = fields.designation;
    var content = fields.content;
    var linkedin_url = fields.linkedin_url;
    var member_image = member_image;
    var status = fields.status;
    var updated_at = Date.now();

    TeamMember.update({ _id: member_id }, {
      $set: {
        name: name,
        designation: designation,
        content: content,
        member_image: member_image,
        linkedin_url: linkedin_url,
        status: status,
        updated_at: updated_at,
      }
    }, { upsert: true }, function (err) {
      if (err) {

        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/our-team');
      }
      else {
        req.flash('success_msg', 'Member updated successfully.');
        res.redirect('/our-team');
      }
    })

  })
});


/************************** Update TEAM**************************************/

routes.get('/delete-team-member', middleware_check_login, (req, res) => {

  var current_time = Date.now();

  var id = req.query.id;

  TeamMember.findByIdAndUpdate(id, { $set: { deleted: '1', updated_at: current_time } }, { new: true }).then((success) => {

    if (success) {

      req.flash('success_msg', 'Member deleted successfully.');

      res.redirect('/our-team');
    }

  }, (error) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/our-team');

  }).catch((e) => {

    req.flash('err_msg', 'Something went wrong try again.');

    res.redirect('/our-team');
  });

});




module.exports = routes;

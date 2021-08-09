var express = require('express');
 var app = express();
  var ejs = require('ejs');
   var bcrypt = require('bcryptjs'); 
   var mkdirp = require('mkdirp'); 
   var fs = require('fs-extra'); 
   var path = require('path'); 
   var nodemailer = require('nodemailer'); 
   const request = require('request'); 
   const http = require('http'); 
   var crypto = require('crypto'); 
   const auth = require('../config/auth'); 
   var bip39 = require('bip39'); 
   var exec = require('child_process').exec; 
   const web3 = require('web3'); 
   const paginate = require("paginate-array");
   var qr = require('qr-image'); 
   var dateFormat = require('dateformat');
   const Tx = require('ethereumjs-tx'); 
   var speakeasy = require('speakeasy'); 
   var QRCode = require('qrcode'); 
   const { mail } = require('../helper/mailer')
//    var utils_helper = require('../helpers/helper'); 
//    var {VAULT,MVAULT,TestVAULT} = require('../models/vault');
//    var {VaultRate} = require('../models/vault_admin');
   var {Stake,MainStake,StakeRate} = require('../models/staking');
var moment = require('moment');
const multer=require('multer')
// const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
// const paypal = require('@paypal/checkout-server-sdk');
// var paypal = require('paypal-rest-sdk');
// paypal.configure({
//   'mode': 'live', //sandbox or live
//   'client_id': 'AfpzL6pl7KLrv8cuvov_3T-sxbBinF7sxEI1cWIGN_uizH91aD9xmcs_znivQwKd96fmK2dnGe-fyJ9W',
//   'client_secret': 'ECM2KAjyuWJ0CGFW9BF_DvhTrD98E-SOlbjjVkqtdlQDOOaSvIIUiJHNMgxffNDDTV7E4izGQ_3tkMUL'
// });


web3js = new web3(new web3.providers.HttpProvider("http://3.139.187.183:8503"));

var {AdminInfo,AdminAddresses} = require('../models/admin');
var {Registration,Userwallet,Importwallet,Tokensettings,Tokendetails,OrderDetails,RefCode,FAQ,ContactInfo,WalletBalance,AppVersion} = require('../models/contact');
// const {TeamMember,Vision,ProductInfo,RoadMapInfo,GraphInfo,TermsInfo,PolicyInfo} = require('../models/team_info');
const {BannerInfo,Aboutus,PartnerInfo,KeyFeaturesInfo,DocumentInfo,GetInTouch} = require('../models/home_content');
// var {BulkTemp,Bulk3Temp,Bulk4Temp,Bulk5Temp,Bulk6Temp,Bulk7Temp,Bulk8Temp,BulkTempBhavna,UniqueBalnce,WalletBalanceLatest,LATokenBalnce} = require('../models/temp');


var tokenContractABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"tokenOwner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"donation","type":"address"}],"name":"Donation","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"donator","type":"address"},{"indexed":false,"internalType":"address","name":"donnationAddress","type":"address"}],"name":"DonationAddressOf","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward_amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"epochCount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"newChallengeNumber","type":"bytes32"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"_MAXIMUM_TARGET","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_MINIMUM_TARGET","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"challengeNumber","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"epochCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastRewardAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastRewardEthBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastRewardTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"latestDifficultyPeriodStarted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"miningTarget","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"solutionForChallenge","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"targetForEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"timeStampForEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes32","name":"challenge_digest","type":"bytes32"}],"name":"mint","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getChallengeNumber","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMiningDifficulty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMiningTarget","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMiningReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes32","name":"challenge_digest","type":"bytes32"},{"internalType":"bytes32","name":"challenge_number","type":"bytes32"}],"name":"getMintDigest","outputs":[{"internalType":"bytes32","name":"digesttest","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes32","name":"challenge_digest","type":"bytes32"},{"internalType":"bytes32","name":"challenge_number","type":"bytes32"},{"internalType":"uint256","name":"testTarget","type":"uint256"}],"name":"checkMintSolution","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"donationTo","outputs":[{"internalType":"address","name":"donationAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"donationAddress","type":"address"}],"name":"changeDonation","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"},{"internalType":"address[]","name":"donation","type":"address[]"},{"internalType":"address","name":"admin","type":"address"}],"name":"transferAndDonateTo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"base","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"mintToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]



// var options = {  
//     url: "http://3.137.11.222:8502",
//     method: 'POST',
//     headers:
//     { 
//      "content-type": "application/json"
//     },
//     body: JSON.stringify({"jsonrpc":"2.0","method":"personal_newAccount","params":['123456'],"id":1})
// };


var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
var indiaTime = new Date(indiaTime);
var currentDate=indiaTime.toLocaleString();
console.log(currentDate);

// request(options, function (error, response, body) {console.log(body)});
//************ to get user data on header using session **********//
app.use(function(req, res, next){
    res.locals.session = req.session;
    var user_id=res.locals.session.re_us_id;
     Registration.findOne({'_id': user_id},function(err,result)
      { 
        if(err){
          console.log('Something went wrong');

        }else{
          res.locals.greet = function(){
          return result;
        }
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
         next();
        }
      });  
});



app.get('/api/gauth_status', function (req, res) {
  // hide or show
  res.json({status:1,msg:"success",data:{ status: "hide"}});
})

app.get('/api/maintenance_status', function (req, res) {
  // true or false
  res.json({status:1,msg:"success",data:{ status: false}});
})





app.get('/api/csrf', function (req, res) {
  // pass the csrfToken to the view
  res.json({status:1,msg:"success",data:{ csrfToken: req.csrfToken() }});
})


app.get('/api/versions', function (req, res) {
  AppVersion.findOne().then((versionData)=>{
    res.json({status:1,msg:"success",data:{android_version:versionData.android_version, android_URL:versionData.android_URL, ios_version:versionData.ios_version, ios_URL:versionData.ios_URL, message:versionData.msg}});
  }).catch(err => {
    console.logO(err);
    res.json({status:0,msg:"failed",data:"Something went wrong."});
  })
})


//***************** post  login api**************//
app.post('/api/login',function(req,res){  
    password = req.body.password.trim();
    var ios_user = req.body.ios_user;
    var mykey = crypto.createCipher('aes-128-cbc', 'mypass');
    var mystr = mykey.update(password, 'utf8', 'hex')
    mystr += mykey.final('hex');
    Registration.find({'email': req.body.email.trim(),'password':mystr},function(err,result){
        if (err) {
        console.log(err);
        res.json({status:0,msg:"failed",data:'The username or password is incorrect.'});
        } else { 
            if(result){
                var status;
                if(result[0] != undefined && result[0] != null){
                    status = result[0].status
                }else{
                    result.status
                }
                if(result.length > 0 && result.length==1 )
                {
                    if (status == 'active') {
                      if(ios_user == "yes"){
                        res.json({status:1,msg:"success",data:{user:result}});
                      }else{
                        res.json({status:1,msg:"success",data:{user:result}});
                        // if(result[0].qr_secret != ""){
                        //   res.json({status:1,msg:"success",data:{email:result[0].email}});
                        // }else{
                        //   const secret = speakeasy.generateSecret({
                        //     length: 10,
                        //     name: 'Rowan_Energy',
                        //     issuer: 'Rowan_Energy'
                        //   });
                        //   var url = speakeasy.otpauthURL({
                        //     secret: secret.base32,
                        //     label: 'Rowan_Energy',
                        //     issuer: 'Rowan_Energy',
                        //     encoding: 'base32'
                        //   });
                        //   QRCode.toDataURL(url, (err, dataURL) => {
                        //     var secret_code = secret.base32;
                        //     var qrcode_data = dataURL
                            // res.json({status:1,msg:"success",data:{secret_code,dataURL,email:result[0].email}});
                        //   });
                        // }
                      }
                    }else {
                      res.json({status:0,msg:"failed",data:'Your account is deactivated.'});
                    }
        
                }
                else
                {
                  res.json({status:0,msg:"failed",data:'The username or password is incorrect.'});
                }
            }else{
                 res.json({status:0,msg:"failed",data:'The username or password is incorrect.'});
            }
        }
    });
});

app.post('/api/verify_account',function(req,res){
    var user_token = req.body.authcode;
    var email =   req.body.email.trim();
    var ios_user = req.body.ios_user;
    Registration.find({'email': email},function(err,result){
    if (err) {
      res.json({status:0,msg:"failed",data:'Something went wrong.'});
    }else{
      if(result!=null && result!=undefined && result!="" && result.length > 0){
          if(email == "ramanpreetraina@questglt.com"){
            if(user_token == "123456"){
              if(ios_user == "yes"){
                Registration.update({email:email},{$set:{qr_status:'verified'}}).then(qr_success =>{
                  res.json({status:1,msg:"success",data:result});
                }).catch(err => {
                  console.log(err);
                })
              }else{
                res.json({status:1,msg:"success",data:result});
              }
              
            }else{
              res.json({status:0,msg:"failed",data:'Please enter correct secret code.'});
            }
          }else{
            secret_code = result[0].qr_secret;
            var verified = speakeasy.totp.verify({ secret: secret_code,
                                      encoding: 'base32',
                                      token: user_token });
            if (verified ==false) {
              res.json({status:0,msg:"failed",data:'Please enter correct secret code.'});
            }else{
                req.session.is_user_logged_in = true;
                Registration.update({email:email},{$set:{qr_status:'verified'}}).then(qr_success =>{
                  res.json({status:1,msg:"success",data:result});
                }).catch(err => {
                  console.log(err);
                })
            }
            

          }
       
        
      }else{
        res.json({status:0,msg:"failed",data:'Something went wrong.'});
      }
    }
    });
});

//***************** post signup **************//
app.post('/api/submit_registration',function(req,res){
  var ref_code = generateCode();
  var name       = req.body.name.trim();
  var last_name       = req.body.last_name.trim();
  var email      = req.body.email.trim();
  var password     = req.body.password.trim();
  let otp = Math.floor(Math.random() * 900000) + 100000;
  var ref_link;
  if (req.body.ref_link != "" && req.body.ref_link != undefined) {
    ref_link = req.body.ref_link.trim();
  } else {
    ref_link = "";
  }
  let mykey = crypto.createCipher('aes-128-cbc', 'mypass');
  let mystr = mykey.update(password, 'utf8', 'hex')
  mystr += mykey.final('hex');

  var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
     var indiaTime = new Date(indiaTime);
     var created_at=indiaTime.toLocaleString();
           
 Registration.find({'email': req.body.email},function(err,result){
   if (err) {
    res.json({status:0,msg:"failed",data:'Please enter valid email address.'});
    } else {
      if(result.length > 0)
      {
        res.json({status:0,msg:"failed",data:'Email already exists. Please enter another email.'});
      }
      else
      {
        let RegistartionData = new Registration({
            name: name+" "+last_name,
            first_name: name,
            last_name: last_name,
            email: email,
            password: mystr,
            created_at: created_at,
            email_verify_status: 'pending',
            mobile_no: '',
            address: '',
            user_address: '',
            country: '',
            state: '',
            city: '',
            status: 'active',
            profile_image: '',
            // dataURL               : dataURL,
            // qr_secret             : secret_code,
            // qr_status             : 'pending',
            ref_code: ref_code,
            otp: otp

        })
        RegistartionData.save(async function (err,doc) {
            if (err){
              console.log(err);
            } else 
            {
              if(ref_link!=""){
                var refData = new RefCode({
                  my_ref_code:ref_code,
                  reg_ref_code:ref_link,
                  user_id:doc._id
                })
                refData.save()
                .then(async (success) =>{
                  console.log(success);
                  let subject = 'Verify email';

                            let text = 'Dear Customer,' + '\n\n' +
                                'Thanks for registering.Your OTP is: ' + '\n\n' + otp +
                                '\n\n' + 'Here is the verify link: http://' + req.headers.host + '/Verify_account' +
                                '\n\nThanks and Regards,' + '\n' + 'ArtW Team' + '\n\n';
                            await mail(email, subject, text)
                                .then((data) => {
                                    res.json({status:1,msg:"success",data:{msg:'Verify link has been sent successfully to your registered email.',user_id:doc._id,otp:otp}});
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                  
                })
                .catch(err => {
                  console.log(err);
                }) 
              }else{
                let subject = 'Verify email';

                let text = 'Dear Customer,' + '\n\n' +
                    'Thanks for registering.Your OTP is: ' + '\n\n' + otp +
                    '\n\n' + 'Here is the verify link: http://' + req.headers.host + '/Verify_account' +
                    '\n\nThanks and Regards,' + '\n' + 'ArtW Team' + '\n\n';
                await mail(email, subject, text)
                    .then((data) => {
                        res.json({status:1,msg:"success",data:{msg:'Verify link has been sent successfully to your registered email.',user_id:doc._id,otp:otp}});
                    })
                    .catch((err) => {
                        console.log(err);
                    })
              }
            }
          })
        // const secret = speakeasy.generateSecret({
        //   length: 10,
        //   name: 'Rowan_Energy',
        //   issuer: 'Rowan_Energy'
        // });
        // var url = speakeasy.otpauthURL({
        //   secret: secret.base32,
        //   label: 'Rowan_Energy',
        //   issuer: 'Rowan_Energy',
        //   encoding: 'base32'
        // });
        // QRCode.toDataURL(url, (err, dataURL) => {
        //   var secret_code = secret.base32;
        //   var qrcode_data = dataURL
        //   res.json({status:1,msg:"success",data:{ref_link,secret_code,dataURL,name,email,password}});
        // });
      }    
    }
  });       
});

app.post('/api/verify_otp', function (req, res) {
    let user_otp = req.body.otp;
    let user_id = req.body.user_id;
    Registration.findOne({ '_id': user_id }, async function (err, result) {
        if (err) {
            res.json({status:0,msg:"failed",data:'Something went wrong.'});
        } else {
            if (result) {
                if(result.email_verify_status == 'pending'){
                    console.log("result result.otp---------------2", result.otp);
                    console.log("result user_otp---------------2", user_otp);
                if (result.otp == user_otp) {
                    console.log("result error---------------2", err);
                    await Registration.updateOne({ _id: result._id }, { $set: { email_verify_status: 'verified', otp: null } })
                    res.json({status:1,msg:"success",data:{user:result}});
                }
                else {
                    // console.log("result error---------------3", err);
                    // req.flash('err_msg', 'Please enter correct secret code.');
                    res.json({status:0,msg:"failed",data:'Please enter correct OTP.'});
                }
            }else{
                res.json({status:0,msg:"failed",data:'Email already verified.'});
                }
            } else {
                // console.log("result error---------------4", err);
                // req.flash('err_msg', 'Something went wrong.');
                // res.redirect('/Verify_account')
                res.json({status:0,msg:"failed",data:'Something went wrong.'});
            }
        }
    });
});



function generateCode() { 
          
  var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
  let code = ''; 
    
  var len = string.length; 
  for (let i = 0; i < 10; i++ ) { 
      code += string[Math.floor(Math.random() * len)]; 
  } 
  return code; 
}

app.post('/api/submit_gauth',function(req,res){  
  var ref_code = generateCode();
  var ios_user = req.body.ios_user;
  user_token = req.body.authcode;
  secret_code = req.body.secret_code;
  dataURL   = req.body. dataURL;
  email = req.body.email;
  name= req.body.name;
  if(req.body.password){
    password = req.body.password.trim();
  }else{
    password = "";
  }
  console.log(password);

  var ref_link;
  if (req.body.ref_link != "" && req.body.ref_link != undefined) {
   	ref_link = req.body.ref_link.trim();
  } else {
   	ref_link = "";
  }

  var verified = speakeasy.totp.verify({ secret: secret_code,
    encoding: 'base32',
    token: user_token 
  });
  console.log(verified);
  if (verified==false) {
    console.log("if");
    err_msg = '';
    success_msg ='';
    res.json({status:0,msg:"failed",data:'The Verification code is  incorrect.'});  
  }else{
    Registration.findOne({'email': email}).then(userdata =>{
      if(userdata && userdata!="" && userdata!=null && userdata!=undefined){
        if(ios_user == "yes"){
          Registration.update({_id:userdata._id},{$set:{ dataURL:dataURL, qr_secret:secret_code, qr_status:'verified'}}).then(auth_success =>{
            res.json({status:1,msg:"success",data:userdata});
          }).catch(err => {
            console.log(err);
          })
        }else{
          Registration.update({_id:userdata._id},{$set:{ dataURL:dataURL, qr_secret:secret_code}}).then(auth_success =>{
            res.json({status:1,msg:"success",data:userdata});
          }).catch(err => {
            console.log(err);
          })
        }
        
      }else{
        var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
        var indiaTime = new Date(indiaTime);
        var created_at=indiaTime.toLocaleString();

        var mykey = crypto.createCipher('aes-128-cbc', 'mypass');
        var mystr = mykey.update(password, 'utf8', 'hex')
        mystr += mykey.final('hex');  
        console.log("OTP" +mystr) 
        
        var RegistartionData = new Registration({
          name                  :  name,
          first_name            :  name,
          last_name             :  '',
          email                 :  email,
          password              :  mystr,
          created_at            :  created_at,
          email_varify_status   :  '',
          mobile_no             :  '',
          address               :  '', 
          user_address          :  '',
          country               :  '',
          state                 :  '',
          city                  :  '',
          status                :  'active',
          profile_image         :  '',
          dataURL               : dataURL,
          qr_secret             : secret_code,
          qr_status             : 'pending',
          ref_code              : ref_code
        })
        RegistartionData.save(function (err,doc) {
          if (err){
            console.log(err);
          } else 
          {
            if(ref_link!=""){
              var refData = new RefCode({
                my_ref_code:ref_code,
                reg_ref_code:ref_link,
                user_id:doc._id
              })
              refData.save()
              .then(success =>{
                console.log(success);
                res.json({status:1,msg:"success",data:doc});
              })
              .catch(err => {
                console.log(err);
              }) 
            }else{
              res.json({status:1,msg:"success",data:doc});
            }
          }
        })
      }
    })     
  }
});


//***************** post IOS signup **************//
app.post('/api/ios/submit_registration',function(req,res){
  var name       = req.body.name.trim();
  var email      = req.body.email.trim();
  var password     = req.body.password.trim();
  var ref_code = generateCode();

  var ref_link;
  if (req.body.ref_link != "" && req.body.ref_link != undefined) {
    ref_link = req.body.ref_link.trim();
  } else {
    ref_link = "";
  }

  var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
  var indiaTime = new Date(indiaTime);
  var created_at=indiaTime.toLocaleString();
           
  Registration.find({'email': req.body.email},function(err,result){
    if (err) {
      res.json({status:0,msg:"failed",data:'Please enter valid email address.'});
    } else {
      if(result.length > 0)
      {
        res.json({status:0,msg:"failed",data:'Email already exists. Please enter another email.'});
      }
      else
      {
        var mykey = crypto.createCipher('aes-128-cbc', 'mypass');
        var mystr = mykey.update(password, 'utf8', 'hex')
        mystr += mykey.final('hex');  
        console.log("OTP" +mystr) 
        var RegistartionData = new Registration({
          name                  :  name,
          first_name            :  name,
          last_name             :  '',
          email                 :  email,
          password              :  mystr,
          created_at            :  created_at,
          email_varify_status   :  '',
          mobile_no             :  '',
          address               :  '', 
          user_address          :  '',
          country               :  '',
          state                 :  '',
          city                  :  '',
          status                :  'active',
          profile_image         :  '',
          dataURL               : '',
          qr_secret             : '',
          qr_status             : 'pending',
          ref_code              : ref_code
        })
        RegistartionData.save(function (err,doc) {
          if (err){
            console.log(err);
          } else 
          {
            if(ref_link!=""){
              var refData = new RefCode({
                my_ref_code:ref_code,
                reg_ref_code:ref_link,
                user_id:doc._id
              })
              refData.save()
              .then(success =>{
                console.log(success);
                res.json({status:1,msg:"success",data:doc});
              })
              .catch(err => {
                console.log(err);
              })   
            }else{
              res.json({status:1,msg:"success",data:doc});
            }
          }
        })
      }    
    }
  });       
});



//***************** get dashboard **************//
app.post('/api/Dashboard',function(req,res){
  var wallet_details="";
  var import_wallet_id="";
  var rown_bal="";

   var user_id=req.body.user_id;
   Registration.findOne({"_id":user_id}).then(user => {
    var ref_code = user.ref_code;
  Tokensettings.findOne().then(values => {
    var usdValue = values.usdValue;
    var etherValue = values.etherValue;
    var btcValue = values.btcValue;
    Importwallet.findOne({'user_id': user_id,'login_status':'login'},function(err,loginwallet){
   if (err) {
    console.log("Something went wrong");
    }
   else{
    if(loginwallet !="" && loginwallet!=undefined)
    {
        Userwallet.findOne({'_id': loginwallet.wallet_id},function(err,result){
        if (err) {console.log("Something went wrong");}
        else{ 
         
         wallet_details=result;
         import_wallet_id=loginwallet._id;
  
          var options = {  
          url: "http://3.137.11.222:8502",
          method: 'POST',
          headers:
          { 
          "content-type": "application/json"
          },
          body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getBalance","params":[wallet_details.wallet_address,"latest"],"id":1})
          };
          request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {

          var get_bal=JSON.parse(body);
          var total_bal=get_bal.result;
          var count_balance = parseInt(total_bal);
          var balance=count_balance/Math.pow(10,18)
          var user1=tokenContractABI;     
          var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
  
            tokenContract.methods.balanceOf(wallet_details.wallet_address).call().then(function (result) {
            
            var count_balance = parseInt(result);
            rown_bal=count_balance/Math.pow(10,7);
            res.json({status:1,msg:"success",data:{ref_code,wallet_details,usdValue,etherValue,btcValue,import_wallet_id,rown_bal}});
            // res.render('front/dashboard',{err_msg,success_msg,ref_code,wallet_details,usdValue,etherValue,btcValue,import_wallet_id,balance,rown_bal,layout: false,session: req.session,crypto});
        
      });
         
          }else{
            console.log(error);
            console.log("get balance api is not working");
          }
          });
        }});
    }
    else
    {
      wallet_details="";
      import_wallet_id="";
      rown_bal="";
      res.json({status:1,msg:"success",data:{ref_code,wallet_details,usdValue,etherValue,btcValue,import_wallet_id,rown_bal}});
      // res.render('front/dashboard',{err_msg,success_msg,ref_code,wallet_details,usdValue,etherValue,btcValue,import_wallet_id,rown_bal,layout: false,session: req.session,crypto});
    }
  }
  }); 
  })
  })
  
});



/************G Auth check**************/
app.post('/api/qr_status',(req,res) => {
  var user_id = req.body.user_id;
  Registration.findOne({_id:user_id}).then(userdata => {
    if(userdata && userdata.qr_secret!="" && userdata.qr_secret!=null && userdata.qr_secret!=undefined){
      if(userdata.qr_status=='pending'){
        res.json({status:1,msg:"success",data:{email:userdata.email}});
      }else{
        res.json({status:1,msg:"success",data:{status:true}});
      }   
    }else{
      const secret = speakeasy.generateSecret({
        length: 10,
        name: 'ARTW_Blockchain',
        issuer: 'ARTW_Blockchain'
      });
      var url = speakeasy.otpauthURL({
        secret: secret.base32,
        label: 'ARTW_Blockchain',
        issuer: 'ARTW_Blockchain',
        encoding: 'base32'
      });
      QRCode.toDataURL(url, (err, dataURL) => {
        var secret_code = secret.base32;
        var qrcode_data = dataURL
        res.json({status:1,msg:"success",data:{secret_code,dataURL,email:userdata.email}});
      });
    }
  })
})



/*************Logout****************/

app.post('/api/ios/logout',(req,res) => {
  var user_id = req.body.user_id;
  Registration.update({_id:user_id},{$set:{qr_status:'pending'}}).then(qr_success =>{
    res.json({status:1,msg:"success",data:"Logout successfully!"});
  }).catch(err => {
    console.log(err);
  })
})


app.post('/api/check-wallet-status',(req,res) => {
  var user_id = req.body.user_id;
  Importwallet.find({user_id:user_id,login_status:"login"}).then(walletdata => {
    if(walletdata && walletdata!="" && walletdata!=null && walletdata!=undefined){
      res.json({status:1,msg:"success",data:{wallet_status : 'login'}});
    }else{
      res.json({status:1,msg:"success",data:{wallet_status : 'logout'}});
    }
  }).catch(err => {
    res.json({status:0,msg:"failed",data:"Something went wrong."});
  })
})


//***************** get Create-wallet **************//
app.get('/api/Create-rwn-wallet',function(req,res){
  var passphrase="";
  
  var mnemonic=bip39.generateMnemonic();
   if(mnemonic)
   {
    var response={success:1,secret:mnemonic};  
    var data = JSON.stringify(response); 
    var new_code=JSON.parse(data);
    var passphrase=new_code.secret
   }
   else
   {
     var response2={ success:0}; 
     var data = JSON.stringify(response2); 
     res.send(data.secret);
   }
    res.json({status:1,msg:"success",data:passphrase});
  
});


/***************** post submit-create-wallet **************/
app.post('/api/submit-create-wallet',function(req,res){  
  var user_id=req.body.user_id;
  var user_passphrase=req.body.passphrase.trim();
  var check_passphrase=req.body.check_passphrase.trim();
  var hash = crypto.createHash('sha256').update(user_passphrase).digest('base64');
  Registration.find({_id:user_id}).then(userData =>{
    console.log(user_passphrase);
    if(user_passphrase == check_passphrase){
    
    var options = {  
        url: "http://3.137.11.222:8502",
        method: 'POST',
        headers:
        { 
         "content-type": "application/json"
        },
        body: JSON.stringify({"jsonrpc":"2.0","method":"personal_newAccount","params":[user_passphrase],"id":1})
    };
    request(options, function (error, response, body) {
    console.log("error",error);
    console.log("response",response);
    console.log("body",body);
       if (!error && response.statusCode == 200) {
       console.log("status",error);
        var get_result=JSON.parse(body);
        var result=get_result.result;
          var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
          var indiaTime = new Date(indiaTime);
          var created_at=indiaTime.toLocaleString();
          
         
        console.log(created_at);
          var UserwalletData = new Userwallet({
                    user_id               :  user_id,
                    wallet_address        :  result,
                    passphrase            :  hash,
                    created_at            :  created_at,
                    status                :  'active',
                    deleted               :   '0'
                 });
    
                UserwalletData.save(function (err,doc) {
                if (err){
                  res.json({status:0,msg:"failed",data:'Something went wrong.'});
                } else 
                { 
                  var ImportwalletData = new Importwallet({
                    user_id               :  user_id,
                    wallet_id             :  doc._id,
                    login_status          :  'login',
                    created_at            :  created_at,
                    status                :  'active',
                    deleted               :   '0'
                 });
                   ImportwalletData.save(function (err,doc1) {
                if (err){
                  res.json({status:0,msg:"failed",data:'Something went wrong.'});
                } else 
                {
                  Importwallet.find({'user_id': user_id,'login_status':'login','_id': { '$ne':doc1._id }},function (err,doc) {
                  if (err){
                    res.json({status:0,msg:"failed",data:'Something went wrong.'});
                  } 
                  else 
                  { 
                    if(doc !="" && doc != undefined)
                    {
                    Importwallet.updateMany({'user_id':user_id,'_id': { '$ne':doc1._id }}, {$set: { login_status: 'logout' }}, {upsert: true}, function(err,result){
                    if (err){ console.log(err); } 
                    else 
                    { console.log('login status update successfully.'); }});
                    }
                 }});
                  res.json({status:1,msg:"success",data:{wallet_address:result}});
                 }});
                } 
                });
       }else{
          // res.write(response.statusCode.toString() + " " + error);
        } 
    });
    }
    else{
      res.json({status:0,msg:"failed",data:'Passphrase does not match.'});
    }
  }) 
});


/***************** post submit-create-wallet **************/
app.post('/api/import-rwn-wallet',function(req,res){  
  var user_id=req.body.user_id;
  var Passphrase=req.body.passphrase.trim();
  var hash1 = crypto.createHash('sha256').update(Passphrase).digest('base64');
  Userwallet.findOne({'passphrase':hash1},function (err,doc) {
  if (err){
  console.log('Something went wrong.');
  } 
  else 
  { 
  if(doc!= "" && doc!=undefined)
  {
      Importwallet.findOne({'wallet_id':doc._id,'user_id':user_id},function (err,doc1) {
        if (err){
        console.log(err);
        } 
        else 
        {
          if(doc1!="" && doc1!=undefined)
          {
  
              if(doc1.login_status=='logout')
                  {
                    Importwallet.updateOne({'user_id':user_id,'wallet_id':doc1.wallet_id}, {$set: { login_status: 'login' }}, {upsert: true}, function(err,result){
                        if (err){ console.log(err); } 
                        else 
                        { 
                          console.log('login status update successfully.'); 
                        Importwallet.find({'user_id': user_id,'login_status':'login','_id': { '$ne':doc1._id }},function (err,doc4) {
                        if (err){ console.log('Something is worng to find login status.') } 
                        else 
                        { 
                        if(doc4 !="" && doc4 != undefined)
                        {
                        Importwallet.updateMany({'user_id':user_id,'_id': { '$ne':doc1._id }}, {$set: { login_status: 'logout' }}, {upsert: true}, function(err,result){
                        if (err){ console.log(err); } 
                        else 
                        { 
                          console.log('login status update successfully2.'); }});
                        }
                        }});
  
                         res.json({status:1,msg:"success",data:{wallet_address:doc.wallet_address,wallet_id:doc._id}});
                          
                          
                        }});
                }
                else
               {  
                res.json({status:1,msg:"success",data:{wallet_address:doc.wallet_address,wallet_id:doc._id}});
               } 
  
          }
          else
          {
  
  
        var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
        var indiaTime = new Date(indiaTime);
        var created_at=indiaTime.toLocaleString();
        
  
  
            var ImportwalletData1 = new Importwallet({
                  user_id               :  user_id,
                  wallet_id             :  doc._id,
                  login_status          :  'login',
                  created_at            :  created_at,
                  status                :  'active',
                  deleted               :   '0'
               });
                 ImportwalletData1.save(function (err,doc2) {
              if (err){
              req.flash('err_msg', 'Something went wrong.');
              res.redirect('/Create-wallet');
              } else 
              { 
                Importwallet.find({'user_id': user_id,'login_status':'login','_id': { '$ne':doc2._id }},function (err,doc3) {
                if (err){ console.log('Something is worng to find login status.') } 
                else 
                { 
                  if(doc3 !="" && doc3 != undefined)
                  {
                    Importwallet.updateMany({'user_id':user_id,'_id': { '$ne':doc2._id }}, {$set: { login_status: 'logout' }}, {upsert: true}, function(err,result){
                    if (err){ console.log(err); } 
                    else 
                    { console.log('login status update successfully2.'); }});
                  }
               }});
  
                 res.json({status:1,msg:"success",data:{wallet_address:doc.wallet_address,wallet_id:doc._id}});
              } });
          }      
      }});   
  }
  else
  {
    res.json({status:0,msg:"failed",data:'Please enter valid passphrase.'});
  }
  }
  });
});


//************post Wallet logout************//
app.post('/api/wallet-logout',function(req,res){
  var wallet_id=req.body.wallet_id;
  var user_id=req.body.user_id;   
  Importwallet.findOne({'_id':wallet_id}).then(walletdata => {
    if(walletdata && walletdata != "" && walletdata!=null && walletdata!=undefined){
      if(walletdata.login_status == 'logout'){
        res.json({status:1,msg:"success",data:"Wallet already logout."});
      }else{
        Importwallet.update({'_id':wallet_id}, {$set: { login_status: 'logout' }}, {upsert: true}, function(err,response){
          if (err){ console.log(err); res.send('error'); } 
          else{ 
            // console.log(response.nModified); 
            if(response.nModified !="" && response.nModified > 0)
            {
              res.json({status:1,msg:"success",data:"Wallet logout successful."});
            }
          }
        }); 
      }
    }
  })
});



app.post('/api/submit-send-rowan',function(req,res){  
  var user_id=req.body.user_id;
  // var user_correct_passphrese=req.body.user_cr_pass.trim();
  var entered_passphrese=req.body.enter_passphrase.trim();
  // var hashnew=crypto.createHash('sha256').update(entered_passphrese).digest('base64');
  var sender_address=req.body.sender_address.trim();
  var reciver_address=req.body.receiver_address.trim();
  var get_amount=req.body.amount_send.trim();
  var wallet_id=req.body.wallet_id.trim();
  Tokensettings.findOne().then(rowan_usd_data => {
    var r_usd_value = rowan_usd_data.usdValue;
    var total_r =  (20/parseFloat(r_usd_value));
    if(parseFloat(get_amount) > parseFloat(total_r) || parseFloat(get_amount) == parseFloat(total_r) ){
      var options = {  
        url: "http://3.137.11.222:8502",
        method: 'POST',
        headers:
        { 
          "content-type": "application/json"
        },
        body: JSON.stringify({"jsonrpc":"2.0","method":"personal_unlockAccount","params":[sender_address,entered_passphrese],"id":1})
      };
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var body_data = JSON.parse(body);
          if(body_data.result==true){
            var options4 = {  
              url: "http://3.137.11.222:8502",
              method: 'POST',
              headers:
              { 
                "content-type": "application/json"
              },
              body: JSON.stringify({"jsonrpc":"2.0","method":"personal_listWallets","params":[],"id":1})
            };
            request(options4, function (error, response, body) {
              var c = JSON.parse(body).result;
              c.forEach(function(element) {
                var accounts_details = element.accounts;
                accounts_details.forEach(function(element1) {
                  if (element1.address==sender_address) {
                    var parts = element1.url.split('/');
                    var lastSegment = parts.pop() || parts.pop();  
                    console.log("lastSegment",lastSegment);
                    var options6 = {
                      url: `http://3.137.11.222/devnetwork/node2/keystore/${lastSegment}`,
                      method: 'GET',
                      headers:{
                        "content-type": "application/json"
                      }
                    }
                    request(options6,function (error, response, body) {
                      if (!error && response.statusCode == 200) {
                        var options = {  
                          url: "http://3.137.11.222:8502",
                          method: 'POST',
                          headers:
                          { 
                            "content-type": "application/json"
                          },
                          body: JSON.stringify({"jsonrpc":"2.0","method":"clique_getSigners","params":[],"id":1})
                        };
                        request(options, function (error5, response5, body5) {
                          console.log("error5",error5);
                          console.log("body5",body5);
                          if (!error5 && response5.statusCode == 200) {
                            var validators=JSON.parse(body5);
                            var all_validators=validators.result;
                            console.log("inside"+all_validators);
                            var csv = body;
                            console.log(csv)  
                            var c =  web3js.eth.accounts.decrypt(csv,entered_passphrese);
                            console.log(c.privateKey);
                            var pk = c.privateKey.slice(2);
                            var sender_private_key=pk;
                            var privateKey = Buffer.from(sender_private_key, 'hex');
                            console.log("private key",privateKey);
                            var user1=tokenContractABI;
                            var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                            var count;
                            tokenContract.methods.balanceOf(sender_address).call().then(function (result) {
                              console.log("---------------------------------",result);
                              var count_balance = parseInt(result);
                              rown_bal=count_balance/Math.pow(10,7);
                              console.log("total balance "+rown_bal);
                              console.log("user enter amount "+get_amount)
                              var gas_amount=parseFloat(get_amount)+parseFloat(0.0000001);
                              console.log("add "+parseFloat(gas_amount));
                              if(rown_bal >= gas_amount){ 
                                web3js.eth.getTransactionCount(sender_address).then(function(v) {
                                  console.log("Count: " + v);
                                  count = v;
                                  var amount = get_amount;
                                  var array_donation= [];
                                  var rawTransaction = {
                                    "from": sender_address,
                                    "gasPrice": '0x0',
                                    "gasLimit": web3js.utils.toHex(4600000),
                                    "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
                                    "value": "0x0",
                                    "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7),array_donation,'0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
                                    "nonce": web3js.utils.toHex(count)
                                  }
                                  var transaction = new Tx(rawTransaction);
                                  transaction.sign(privateKey);
                                  web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
                                    if (err) 
                                    {
                                      res.json({status:0,msg:"failed",data:"Insufficient funds In Your account."});
                                    } 
                                    else 
                                    { 
                                      var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
                                      var indiaTime = new Date(indiaTime);
                                      var created_at=indiaTime.toLocaleString();
                                      Tokendetails.count(function (err,respcount){
                                        var count_val=parseFloat(respcount)+parseFloat(1);
                                        var TokendetailsData = new Tokendetails({
                                          auto                       :  count_val,
                                          user_id                    :  user_id,
                                          wallet_id                  :  wallet_id,
                                          sender_wallet_address      :  sender_address,
                                          receiver_wallet_address    :  reciver_address,
                                          hash                       :  hash,
                                          amount                     :  get_amount,
                                          payment_status             :  'pending',
                                          created_at                 :  created_at,
                                          status                     :  'active',
                                          token_type                 :  'ARTW',
                                          transaction_type           :  'Send'
                                        });
                                        TokendetailsData.save(function (err,doc) {
                                          if (err){ console.log('token data is not save.');
                                          } else 
                                          {
                                            var test="";
                                            var requestLoop = setInterval(function(){
                                              check_tx_status(doc.hash,doc._id,function(err,respo,next)
                                              {
                                                console.log('fri'+respo);
                                                if(respo=="tx success")
                                                {
                                                  clearInterval(requestLoop); // stop the interval
                                                  // req.flash('success_msg', 'Your transaction in done.');
                                                  res.json({status:1,msg:"success",data:"Transaction successful."});
                                                }
                                                else
                                                {
                                                  console.log(respo+"inside else");
                                                }
                                              }); 
                                            },100);
                                          }
                                        });
                                      });                           
                                    }
                                  }).on('transactionHash');
                                });
                              }
                              else
                              {
                                res.json({status:0,msg:"failed",data:"Insufficient funds In Your account."});
                              }
                            });
                          } 
                        });  
                      }
                    });
                  }
                });
              });
            });
          }else{
            res.json({status:0,msg:"failed",data:'Please enter valid passphrase.'});
          }    
        }
        else{
          res.write(response.statusCode.toString() + " " + error);
        }
      }); 
    }else{  
      res.json({status:0,msg:"failed",data:`Minimum amount for Rowan transaction is ${total_r}($20).`});
    }
  })  
});




async function check_tx_status(tx_hash,tx_id,callback){
  await web3js.eth.getTransactionReceipt(tx_hash).then(async send_resu => {
    console.log("======================================== "+send_resu);
    if(send_resu!=null && send_resu!="" && send_resu!=undefined)
    {
      var data = JSON.parse(JSON.stringify(send_resu));
      console.log("======================================== "+data.blockNumber);

         await Tokendetails.updateOne({'_id':tx_id}, {$set: { 'payment_status': 'paid' ,'block_id':data.blockNumber}}, {upsert: true}, async function(err,result){
       if (err){ console.log(err); } 
       else 
       { 
            return  callback(null,'tx success');
       }});
    }
    else
    {
       return  callback(null,'tx pending.');
    }
  })
 .catch(async err => {
    return  callback(null,err);
 })  
}


//***************** get recive-rowan **************//
app.post('/api/receive-artw',function(req,res){
  var walletidd=req.body.wallet_id;
  Importwallet.findOne({'_id':walletidd},function (err,response) {
    if (err){ console.log('Something is worng to find login status.') } 
    else 
    { 
      // console.log(response);
      if(response !="" && response!=undefined)
      {
        Userwallet.findOne({_id:response.wallet_id}).then(walletdetails => {
          // console.log("wallet details ",walletdetails );
          let qr_txt=walletdetails.wallet_address;
          var qr_png = qr.imageSync(qr_txt,{ type: 'png'})
          var img_data = qr_png.toString('base64');
          var img_url = 'data:image/png;base64,'+img_data;
          // console.log("img_url ",img_url)
          // res.render('front/receive',{err_msg,success_msg,walletdetails,qr_code_file_name,layout: false,session: req.session,});
          res.json({status:1,msg:"success",data:{wallet_details:walletdetails,img_url:img_url}});
        }).catch(err => {
          console.log("catch err ",err);
          res.json({status:0,msg:"failed",data:"Something went wrong."});
        })
        
      }
    }
  });  
});


//***************** get Transaction-history **************//
app.post('/api/transaction-history',function(req,res){
  var user_id=req.body.user_id;
  Importwallet.findOne({'user_id': user_id,'login_status':'login'},function(err,loginwallet){
    if (err) {
      console.log("Something went wrong");
    }
    else
    { 
      Tokendetails.find({'payment_status':'pending'},function (err,response) {
        if(response!= "" && response!=null && response!=undefined)
        {
          for(var i=0; i<response.length; i++)
          {
            console.log(response.length);
            check_tx_status(response[i].hash,response[i]._id,function(err,respo)
            {
              console.log(respo);
            });
          }
        }
        else
        {
          console.log('no record found.');
        }
  
      });
      async function check_tx_status(tx_hash,tx_id,callback){
        await web3js.eth.getTransactionReceipt(tx_hash).then(async send_resu => {
          console.log("======================================== "+send_resu);
          if(send_resu!=null && send_resu!="" && send_resu!=undefined)
          {
            var data = JSON.parse(JSON.stringify(send_resu));
            console.log("======================================== "+data.blockNumber);
      
               await Tokendetails.updateOne({'_id':tx_id}, {$set: { 'payment_status': 'paid' ,'block_id':data.blockNumber}}, {upsert: true}, async function(err,result){
             if (err){ console.log(err); } 
             else 
             { 
                  return  callback(null,'tx success');
             }});
          }
          else
          {
             return  callback(null,'tx pending.');
          }
        })
       .catch(async err => {
          return  callback(null,err);
       })  
      }

      if(loginwallet !="" && loginwallet !=null && loginwallet!=undefined)
      {
        Userwallet.findOne({'_id':loginwallet.wallet_id},function (err,addresponse) {
          if (err){ console.log('Something is worng to Token details.') } 
          else 
          { 
            var user_wallet=addresponse.wallet_address;
            Tokendetails.find({ $or:[{'receiver_wallet_address':addresponse.wallet_address },{'sender_wallet_address':addresponse.wallet_address }]}).sort([['auto', -1]]).exec(function(err, response) { 
              if (err){ console.log('Something is worng to Token details.') } 
              else 
              {  
                var all_transaction = [];
                for(var b = 0; b < response.length; b++){
                  var created_date = new Date(response[b].created_at);
                  all_transaction.push({transaction:response[b],created_date})
                }
                
                res.json({status:1,msg:"success",data:{user_wallet,all_transaction}});
              }
            });
          }
        });
      }
      else
      {
        var user_wallet="";
        var all_transaction="";
        res.json({status:1,msg:"success",data:{user_wallet,all_transaction}});
      }
    }
  });  
});



app.post('/api/exchange',function(req,res){
  var user_id=req.body.user_id;
  Importwallet.findOne({'user_id': user_id,'login_status':'login'},function(err,loginwallet){
    if (err) {
      console.log("Something went wrong");
    }
    else{
      if(loginwallet !="" && loginwallet!=undefined)
      {
        Userwallet.findOne({'_id': loginwallet.wallet_id},function(err,result){
          if (err) {console.log("Something went wrong");}
          else{ 
            wallet_details=result;
            import_wallet_id=loginwallet._id;
            var options = {  
              url: "http://3.137.11.222:8502",
              method: 'POST',
              headers:
              { 
                "content-type": "application/json"
              },
              body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getBalance","params":[wallet_details.wallet_address,"latest"],"id":1})
            };
            request(options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var get_bal=JSON.parse(body);
                var total_bal=get_bal.result;
                var count_balance = parseInt(total_bal); 
                var balance=count_balance/Math.pow(10,18)
                var user1=tokenContractABI;
                var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                tokenContract.methods.balanceOf(wallet_details.wallet_address).call().then(function (result) {  
                  var count_balance = parseInt(result);
                  rown_bal=count_balance/Math.pow(10,7);
                  // res.render('front/token',{wallet_details,import_wallet_id,rown_bal,layout: false,session: req.session,crypto});
                  res.json({status:1,msg:"success",data:{wallet_details,import_wallet_id,rown_bal}});
                }); 
              }else{
                console.log(error);
                console.log("get balance api is not working");
              }
            });
          }
        });
      }
      else
      {
        wallet_details="";
        import_wallet_id="";
        rown_bal="";
        res.json({status:1,msg:"success",data:{wallet_details,import_wallet_id,rown_bal}});
      }
    }
  })
}); 


app.post('/api/get_bitcoin',async function(req,res){
  var user_id=req.body.user_id;
  await AdminAddresses.findOne().then(async admin_wallets =>{
    console.log("admin wallets ",admin_wallets);
    var admin_btc_address = admin_wallets.btc_address;
    var qr_png = qr.imageSync(admin_btc_address,{ type: 'png'})
    var img_data = qr_png.toString('base64');
    var img_url = 'data:image/png;base64,'+img_data;
    await Tokensettings.findOne().then(async btcresult =>{
      var rwn = btcresult.btcValue;
      await Importwallet.findOne({'user_id': user_id,'login_status':'login'},async function(err,loginwallet){
        if (err) {
          console.log("Something went wrong");
        }
        else{
          if(loginwallet !="" && loginwallet!=undefined)
          {
            await Userwallet.findOne({'_id': loginwallet.wallet_id},async function(err,result){
              if (err) {console.log("Something went wrong");}
              else{
                var wallet_address = result.wallet_address;
                res.json({status:1,msg:"success",data:{admin_btc_address,img_url,wallet_address,user_id,rwn_btc_value:rwn}});
              }
            }) 
          } 
        }
      })
    })  
  })       
});



app.post('/api/get_ethereum',function(req,res){
  var user_id=req.body.user_id;
  AdminAddresses.findOne().then(admin_wallets =>{
    var admin_eth_address = admin_wallets.eth_address;
    var qr_png = qr.imageSync(admin_eth_address,{ type: 'png'})
    var img_data = qr_png.toString('base64');
    var img_url = 'data:image/png;base64,'+img_data;
    Tokensettings.findOne().then(btcresult =>{
      var rwn = btcresult.etherValue;
      Importwallet.findOne({'user_id': user_id,'login_status':'login'},function(err,loginwallet){
        if (err) {
          console.log("Something went wrong");
        }
        else{
          if(loginwallet !="" && loginwallet!=undefined)
          {
              Userwallet.findOne({'_id': loginwallet.wallet_id},function(err,result){
              if (err) {console.log("Something went wrong");}
              else{
                var wallet_address = result.wallet_address;
                res.json({status:1,msg:"success",data:{admin_eth_address,img_url,wallet_address,user_id,rwn_eth_value:rwn}}); 
              }
            }) 
          } 
        }
      })     
    })
  })  
});


app.post('/api/get_xrp',async function(req,res){
    var user_id=req.body.user_id;
    await AdminAddresses.findOne().then(async admin_wallets =>{
      console.log("admin wallets ",admin_wallets);
      var admin_xrp_address = admin_wallets.xrp_address;
      var qr_png = qr.imageSync(admin_xrp_address,{ type: 'png'})
      var img_data = qr_png.toString('base64');
      var img_url = 'data:image/png;base64,'+img_data;
      await Tokensettings.findOne().then(async btcresult =>{
        var rwn = btcresult.xrpValue;
        await Importwallet.findOne({'user_id': user_id,'login_status':'login'},async function(err,loginwallet){
          if (err) {
            console.log("Something went wrong");
          }
          else{
            if(loginwallet !="" && loginwallet!=undefined)
            {
              await Userwallet.findOne({'_id': loginwallet.wallet_id},async function(err,result){
                if (err) {console.log("Something went wrong");}
                else{
                  var wallet_address = result.wallet_address;
                  res.json({status:1,msg:"success",data:{admin_xrp_address,img_url,wallet_address,user_id,rwn_xrp_value:rwn}});
                }
              }) 
            } 
          }
        })
      })  
    })       
});
  

app.post('/api/get_ltc',async function(req,res){
    var user_id=req.body.user_id;
    await AdminAddresses.findOne().then(async admin_wallets =>{
      console.log("admin wallets ",admin_wallets);
      var admin_ltc_address = admin_wallets.ltc_address;
      var qr_png = qr.imageSync(admin_ltc_address,{ type: 'png'})
      var img_data = qr_png.toString('base64');
      var img_url = 'data:image/png;base64,'+img_data;
      await Tokensettings.findOne().then(async btcresult =>{
        var rwn = btcresult.ltcValue;
        await Importwallet.findOne({'user_id': user_id,'login_status':'login'},async function(err,loginwallet){
          if (err) {
            console.log("Something went wrong");
          }
          else{
            if(loginwallet !="" && loginwallet!=undefined)
            {
              await Userwallet.findOne({'_id': loginwallet.wallet_id},async function(err,result){
                if (err) {console.log("Something went wrong");}
                else{
                  var wallet_address = result.wallet_address;
                  res.json({status:1,msg:"success",data:{admin_ltc_address,img_url,wallet_address,user_id,rwn_ltc_value:rwn}});
                }
              }) 
            } 
          }
        })
      })  
    })       
});
  


app.post('/api/get_dash',async function(req,res){
    var user_id=req.body.user_id;
    await AdminAddresses.findOne().then(async admin_wallets =>{
      console.log("admin wallets ",admin_wallets);
      var admin_dash_address = admin_wallets.dash_address;
      var qr_png = qr.imageSync(admin_dash_address,{ type: 'png'})
      var img_data = qr_png.toString('base64');
      var img_url = 'data:image/png;base64,'+img_data;
      await Tokensettings.findOne().then(async btcresult =>{
        var rwn = btcresult.dashValue;
        await Importwallet.findOne({'user_id': user_id,'login_status':'login'},async function(err,loginwallet){
          if (err) {
            console.log("Something went wrong");
          }
          else{
            if(loginwallet !="" && loginwallet!=undefined)
            {
              await Userwallet.findOne({'_id': loginwallet.wallet_id},async function(err,result){
                if (err) {console.log("Something went wrong");}
                else{
                  var wallet_address = result.wallet_address;
                  res.json({status:1,msg:"success",data:{admin_dash_address,img_url,wallet_address,user_id,rwn_dash_value:rwn}});
                }
              }) 
            } 
          }
        })
      })  
    })       
});


app.post('/api/get_money',function(req,res){
  var user_id=req.body.user_id;
  Tokensettings.findOne().then(btcresult =>{
    var rwn = btcresult.usdValue;
    Importwallet.findOne({'user_id': user_id,'login_status':'login'},function(err,loginwallet){
      if (err) {
        console.log("Something went wrong");
      }
      else{
        if(loginwallet !="" && loginwallet!=undefined)
        {
          Userwallet.findOne({'_id': loginwallet.wallet_id},function(err,result){
            if (err) {console.log("Something went wrong");}
            else{
              var wallet_address = result.wallet_address;
              res.json({status:1,msg:"success",data:{wallet_address,user_id,rwn_usd_value:rwn}});
            }
          }) 
        } 
      }
    }) 
  })    
});


app.post('/api/buy_BTC', async (req, res) => {
  console.log("Hello from BTC",req.body);
  var imageFile = req.files;
  console.log("file",req.files);
  var image;
  if(!imageFile){
    image = ""
  }else{
    image = req.files.image.name;
  }
  var user_id=req.body.user_id;
  var rwn_count = req.body.rowan;
  var rowan_rate = await Tokensettings.findOne({});
  var rate_per_rwn = rowan_rate.btcValue;
  console.log("------------BTC ",rate_per_rwn);
  var total_amnt = (rwn_count)*(rate_per_rwn);
  console.log("-----------Total amount ",total_amnt);
  console.log(total_amnt);
  var sender_wallet_address = req.body.bit_wallet_address;
  var trnsaction_Id = req.body.transaction_id;
  var rwn_wallet_address = req.body.wallet_address;
  var payment_type = "BTC";
  var created_at = new Date();
  const order = new OrderDetails({
    user_id:user_id,
    rwn_count:rwn_count,
    rate_per_rwn:rate_per_rwn,
    total_amnt:total_amnt,
    trnsaction_Id:trnsaction_Id,
    rwn_wallet_address:rwn_wallet_address,
    sender_wallet_address:sender_wallet_address,
    image:image,
    payment_type:payment_type,
    created_at:created_at
  })
  order.save()
  .then(result =>{
    mkdirp('public/tx_proof/', function (err) { });
  if (imageFile != null) {
    var imgpath = 'public/tx_proof/'+ image;
    req.files.image.mv(imgpath, function (err) { });
  }
    res.json({status:1,msg:"success",data:"Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification."});
  })
  .catch(err => {
    console.log("error",err);
    res.json({status:0,msg:"failed",data:"Sorry!, we were unable to send your data, please try one more time."});
  })
})


app.post('/api/buy_ETH',async function(req,res){
  console.log("Hello from ETH");
  var user_id=req.body.user_id;
  var rwn_count = req.body.rowan;
  var rowan_rate = await Tokensettings.findOne({});
  var rate_per_rwn = rowan_rate.etherValue;
   console.log("------------ETH ",rate_per_rwn);
  var total_amnt = (rwn_count)*(rate_per_rwn);
  console.log("-----------Total amount ",total_amnt);
  console.log(total_amnt);
  var sender_wallet_address = req.body.eth_wallet_address;
  var trnsaction_Id = req.body.transaction_id;
  var rwn_wallet_address = req.body.wallet_address;
  var imageFile = req.files;
  var image;
  if(!imageFile){
    image = ""
  }else{
    image = req.files.image.name;
  }
  var payment_type = "ETH";
  var created_at = new Date();

  const order = new OrderDetails({
    user_id:user_id,
    rwn_count:rwn_count,
    rate_per_rwn:rate_per_rwn,
    total_amnt:total_amnt,
    trnsaction_Id:trnsaction_Id,
    rwn_wallet_address:rwn_wallet_address,
    sender_wallet_address:sender_wallet_address,
    image:image,
    payment_type:payment_type,
    created_at:created_at
  })
  order.save()
  .then(result =>{
    mkdirp('public/tx_proof/', function (err) { });
    if (imageFile != null) {
      var imgpath = 'public/tx_proof/'+ image;
      req.files.image.mv(imgpath, function (err) { });
    }
    res.json({status:1,msg:"success",data:"Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification."});
  })
  .catch(err => {
    res.json({status:0,msg:"failed",data:"Sorry!, we were unable to send your data, please try one more time."});
  })
});


app.post('/api/buy_xrp', async (req, res) => {
    console.log("Hello from XRP",req.body);
    var imageFile = req.files;
    console.log("file",req.files);
    var image;
    if(!imageFile){
      image = ""
    }else{
      image = req.files.image.name;
    }
    var user_id=req.body.user_id;
    var rwn_count = req.body.rowan;
    var rowan_rate = await Tokensettings.findOne({});
    var rate_per_rwn = rowan_rate.xrpValue;
    console.log("------------XRP ",rate_per_rwn);
    var total_amnt = (rwn_count)*(rate_per_rwn);
    console.log("-----------Total amount ",total_amnt);
    console.log(total_amnt);
    var sender_wallet_address = req.body.xrp_wallet_address;
    var trnsaction_Id = req.body.transaction_id;
    var rwn_wallet_address = req.body.wallet_address;
    var payment_type = "XRP";
    var created_at = new Date();
    const order = new OrderDetails({
      user_id:user_id,
      rwn_count:rwn_count,
      rate_per_rwn:rate_per_rwn,
      total_amnt:total_amnt,
      trnsaction_Id:trnsaction_Id,
      rwn_wallet_address:rwn_wallet_address,
      sender_wallet_address:sender_wallet_address,
      image:image,
      payment_type:payment_type,
      created_at:created_at
    })
    order.save()
    .then(result =>{
      mkdirp('public/tx_proof/', function (err) { });
    if (imageFile != null) {
      var imgpath = 'public/tx_proof/'+ image;
      req.files.image.mv(imgpath, function (err) { });
    }
      res.json({status:1,msg:"success",data:"Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification."});
    })
    .catch(err => {
      console.log("error",err);
      res.json({status:0,msg:"failed",data:"Sorry!, we were unable to send your data, please try one more time."});
    })
})


app.post('/api/buy_ltc', async (req, res) => {
  console.log("Hello from LTC",req.body);
  var imageFile = req.files;
  console.log("file",req.files);
  var image;
  if(!imageFile){
    image = ""
  }else{
    image = req.files.image.name;
  }
  var user_id=req.body.user_id;
  var rwn_count = req.body.rowan;
  var rowan_rate = await Tokensettings.findOne({});
  var rate_per_rwn = rowan_rate.ltcValue;
  console.log("------------LTC ",rate_per_rwn);
  var total_amnt = (rwn_count)*(rate_per_rwn);
  console.log("-----------Total amount ",total_amnt);
  console.log(total_amnt);
  var sender_wallet_address = req.body.ltc_wallet_address;
  var trnsaction_Id = req.body.transaction_id;
  var rwn_wallet_address = req.body.wallet_address;
  var payment_type = "LTC";
  var created_at = new Date();
  const order = new OrderDetails({
    user_id:user_id,
    rwn_count:rwn_count,
    rate_per_rwn:rate_per_rwn,
    total_amnt:total_amnt,
    trnsaction_Id:trnsaction_Id,
    rwn_wallet_address:rwn_wallet_address,
    sender_wallet_address:sender_wallet_address,
    image:image,
    payment_type:payment_type,
    created_at:created_at
  })
  order.save()
  .then(result =>{
    mkdirp('public/tx_proof/', function (err) { });
  if (imageFile != null) {
    var imgpath = 'public/tx_proof/'+ image;
    req.files.image.mv(imgpath, function (err) { });
  }
    res.json({status:1,msg:"success",data:"Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification."});
  })
  .catch(err => {
    console.log("error",err);
    res.json({status:0,msg:"failed",data:"Sorry!, we were unable to send your data, please try one more time."});
  })
})
  

app.post('/api/buy_dash', async (req, res) => {
  console.log("Hello from DASH",req.body);
  var imageFile = req.files;
  console.log("file",req.files);
  var image;
  if(!imageFile){
    image = ""
  }else{
    image = req.files.image.name;
  }
  var user_id=req.body.user_id;
  var rwn_count = req.body.rowan;
  var rowan_rate = await Tokensettings.findOne({});
  var rate_per_rwn = rowan_rate.dashValue;
  console.log("------------DASH ",rate_per_rwn);
  var total_amnt = (rwn_count)*(rate_per_rwn);
  console.log("-----------Total amount ",total_amnt);
  console.log(total_amnt);
  var sender_wallet_address = req.body.dash_wallet_address;
  var trnsaction_Id = req.body.transaction_id;
  var rwn_wallet_address = req.body.wallet_address;
  var payment_type = "DASH";
  var created_at = new Date();
  const order = new OrderDetails({
    user_id:user_id,
    rwn_count:rwn_count,
    rate_per_rwn:rate_per_rwn,
    total_amnt:total_amnt,
    trnsaction_Id:trnsaction_Id,
    rwn_wallet_address:rwn_wallet_address,
    sender_wallet_address:sender_wallet_address,
    image:image,
    payment_type:payment_type,
    created_at:created_at
  })
  order.save()
  .then(result =>{
    mkdirp('public/tx_proof/', function (err) { });
  if (imageFile != null) {
    var imgpath = 'public/tx_proof/'+ image;
    req.files.image.mv(imgpath, function (err) { });
  }
    res.json({status:1,msg:"success",data:"Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification."});
  })
  .catch(err => {
    console.log("error",err);
    res.json({status:0,msg:"failed",data:"Sorry!, we were unable to send your data, please try one more time."});
  })
})


app.post('/api/buy_money',  async (req, res) => {
var user_id = req.body.user_id;
var rwn_count = req.body.rwn_count;
var payment_type = "USD";
var rwn_wallet_address = req.body.rwn_wallet_address;
var trnsaction_Id = req.body.trnsaction_Id;
var rowan_rate = await Tokensettings.findOne({});
var rate_per_rwn = rowan_rate.usdValue;
var tAmount = parseFloat(rwn_count) * parseFloat(rate_per_rwn);
const total_amnt = Math.round((tAmount)*100)/100;

  const order = new OrderDetails({
    user_id:user_id,
    rwn_count:rwn_count,
    rate_per_rwn:rate_per_rwn,
    total_amnt:total_amnt,
    payment_type:payment_type,
    rwn_wallet_address:rwn_wallet_address,
    trnsaction_Id: trnsaction_Id,
    created_at:new Date()
  })
  order.save().then(result =>{
    console.log("money-----------result ",result);
    res.json({status:1,msg:"success",data:"Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification."});
  }).catch(err => {
    console.log("7 ",err);
    res.json({status:0,msg:"failed",data:"Sorry!, we were unable to send your data, please try one more time."});
  })
})

// app.get('/api/success',(req,res,next) => {
//   console.log("hellloooo 8");
//   const payerId = req.query.PayerID;
//   console.log("payerId--------9 ",payerId);
//   const paymentId = req.query.paymentId;
//   console.log("paymentId--------10 ",paymentId);
//   var payId = req.session.moneyId ;
//   var total_amnt;
//   OrderDetails.findOne({'_id':req.session.moneyId}).then(result => {
//   console.log("total_amnt--------11 ",result);

//   if(result.payment_status=='Pending')
//   {
  
//   var execute_payment_json = {
//     "payer_id": payerId,
//     "transactions": [{
//       "amount": {
//         "currency": "USD",
//         "total":result.total_amnt
//       }
//     }]
//   };
//   paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
//   console.log("inside--------execution 12");
//     if (error) {
//         console.log(error.response);
        
//     } else {
//         console.log("Get Payment Response 13");
//         var payResponse = JSON.stringify(payment);
//         var trnsaction_Id = payment.id;
//         console.log("trnsaction_Id 14 ",trnsaction_Id);
//         console.log(payResponse);
//         OrderDetails.updateOne({'_id':payId}, {$set: { 'trnsaction_Id': trnsaction_Id }}, {upsert: true}, function(err,result1){
//           if (err){ console.log(err); } 
//           else 
//           { 
//             console.log("result1 15",result1)
//             res.json({status:1,msg:"success",data:"Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification."});
//           }});
        
//     }
// });

// }
// else
// { 
//   res.json({status:0,msg:"failed",data:"Sorry!, your payment get cancelled."});
// }

//   })
// });

// app.get('/api/cancel',(req,res,next) => {
//   console.log("16")
//   res.json({status:0,msg:"failed",data:"Sorry!, your payment get cancelled."});
// });



//***************** get profile **************//
app.post('/api/get-profile',function(req,res){
  var user_id=req.body.user_id;
  Registration.find({'_id': user_id},function(err,result){
    if (err) {
      console.log("Something went wrong");
    }
    else
    {
      res.json({status:1,msg:"success",data:result});
    }
  });
});
  
  
  //***************** post update profile **************//
app.post('/api/update-profile',function(req,res){ 
  var imageFile;
  if(req.files != null)
  {
    imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    user_image=imageFile;
  }
  else
  {
    if(req.body.old_image_name != "" && req.body.old_image_name != undefined)
    {
      user_image=req.body.old_image_name;
    }
    else
    {
      user_image="";
    }
  }
  var user_id=req.body.user_id;
  var user_first_name=req.body.first_name.trim();
  var profile_image=user_image.trim();
  var user_full_name=user_first_name;
  Registration.update({_id:user_id}, {$set: {first_name:user_first_name,profile_image:profile_image,name:user_full_name}}, {upsert: true}, function(err,result){
    if(err){
      console.log("Something went wrong");    
    }else{
      mkdirp('public/upload_user_profile/', function (err) { });
      if (req.files != null) {
        var imgpath = 'public/upload_user_profile/'+ imageFile;
        req.files.image.mv(imgpath, function (err) { });
        res.json({status:1,msg:"success",data:'Profile updated successfully.'});
      }
      else
      {
        res.json({status:1,msg:"success",data:'Profile updated successfully.'});
      }   
    }
  });
});


//***************** post changes password **************//
app.post('/api/change-password',function(req,res){  
  var user_id=req.body.user_id;
  var old_pass=req.body.password;    
  var mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
  var mystr1 = mykey1.update(old_pass, 'utf8', 'hex')
  mystr1 += mykey1.final('hex');
  Registration.find({'_id':user_id,'password':mystr1},function(err,result){
    if (err) {
      res.json({status:0,msg:"failed",data:'Something is worng.'});
    } else { 
      if(result.length > 0 && result.length ==1)
      {
        var check_old_pass=result[0].password;
        var mykey2 = crypto.createCipher('aes-128-cbc', 'mypass');
        var new_pass = mykey2.update(req.body.new_password, 'utf8', 'hex')
        new_pass += mykey2.final('hex');
        if(mystr1 !=new_pass)
        {
          Registration.update({_id:user_id}, {$set: { password: new_pass }}, {upsert: true}, function(err){
            if (err){
              res.json({status:0,msg:"failed",data:'Something is worng.'});
            } else 
            { 
              res.json({status:1,msg:"success",data:'Password changed successfully.'});
            }
          });
        }
        else
        {
          res.json({status:0,msg:"failed",data:'New password should not be same as current password.'});
        }    
      }
      else
      {
        res.json({status:0,msg:"failed",data:'Please enter correct current password.'});
      }
    }
  });
});



//***************** post forget password **************//
app.post('/api/forgot-password',function(req,res){  
  Registration.find({'email': req.body.email.trim()},function(err,result){
    if (err) {
      res.json({status:0,msg:"failed",data:'Please enter registered Email address.'});
    } else { 
      if(result.length > 0 && result.length ==1)
      {
        new_pass=Math.random().toString(36).slice(-5);
        console.log("new pass",new_pass);
        var mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
        var mystr1 = mykey1.update(new_pass, 'utf8', 'hex')
        mystr1 += mykey1.final('hex'); 
        Registration.update({email:req.body.email.trim()}, {$set: { password: mystr1 }}, {upsert: true}, function(err){
          if (err){
            res.json({status:0,msg:"failed",data:'Something is worng.'});
          } else 
          { 
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
                    'Password: '+new_pass+ '\n http://' + req.headers.host + '/'+ '\n\n' +

                    'We suggest you to please change your password after successfully logging in on the portal using the above password :\n\n' +

                    'Here is the change password link: http://' + req.headers.host + '/login'+ '\n\n' +
                    'Thanks and Regards,' + '\n' + 'ARTW Team' + '\n\n',
            };
            smtpTransport.sendMail(mailOptions, function (err) {
              console.log(err);                    
            });
            res.json({status:1,msg:"success",data:'Password has been sent successfully to your registered email.'});
          }
        });
      }
      else
      {
        res.json({status:0,msg:"failed",data:'Please enter registered Email address.'});
      }
    }
  });
}); 



//***************** Terms and conditions **************//
app.get('/api/terms-n-conditions', (req,res,next) => {
  TermsInfo.findOne().then(terms_n_conditions => {
    res.json({status:1,msg:"success",data:terms_n_conditions});
  }).catch(err => {
    res.json({status:0,msg:"failed",data:'Something is worng.'});
  })
})


function calculateDays(startDate,endDate)
{
   var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
   var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
   var duration = moment.duration(end_date.diff(start_date));
   var days = duration.asDays();       
   return parseInt(days);
}

/***************** Stake **************/


app.post('/api/rowan-stake', (req,res,next) => {
    // req.flash("success_msg","We are down for scheduled maintenance.");
    // res.redirect("/dashboard");
  var user_id = req.body.user_id; 
    // ROWAN ND USD SHOW***
  var page = req.query.page || 1
  var perPage = 10;
  var page_data=[]
  StakeRate.findOne({}).then(interest =>{
    var rules = ["Staking can be made in ARTW tokens only.","Only Once the holding wallet has 1000 ARTW as interest, it can be withdrawn.",`${interest.interest_rate}% interest is added to holding wallet per day, in form of ARTW tokens.`,
       "Minimum investment of 6000 ARTW.","Minimum duration is 30 days.","Withdraw amount should be equal to or less than 900000 ARTW.","After the fixed staking period you have 3 options. First, Withdraw initially staked ARTW (in part or in full) and/or any ARTW earned (provided the amount earned has reached a minimum of 1000 ARTW). Second, Restake the tokens and interest for a further minimum 30 day period. Third, Do nothing. Tokens and interest will automatically be restaked for a further 30 day period after 7 days. This does not apply if any ARTW are withdrawn from the staked amount, and in that situation any remaining tokens will need to be manually restaked."];
    Tokensettings.findOne().then(values => {
      var usdValue = values.usdValue;
      // var etherValue = values.etherValue;
      // var btcValue = values.btcValue;
      Importwallet.findOne({'user_id': user_id,'login_status':'login'},function(err,loginwallet){
        if (err) {
          res.json({status:0,msg:"failed",data:'Something is worng.'});
        }
        else{
          if(loginwallet !="" && loginwallet!=undefined)
          {
            Userwallet.findOne({'_id': loginwallet.wallet_id},function(err,result){
              if (err) {res.json({status:0,msg:"failed",data:'Something is worng.'});}
              else{   
                wallet_details=result;
                import_wallet_id=loginwallet._id;
                var user1=tokenContractABI;     
                var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                tokenContract.methods.balanceOf(wallet_details.wallet_address).call().then(function (result) {
                  var count_balance = parseInt(result);
                  rown_bal=count_balance/Math.pow(10,7);
                  var total_usd = (rown_bal)*(usdValue);
                  MainStake.findOne({user_id:user_id}).then(mvault_data =>{
                    if(mvault_data){
                      var current_usd = (mvault_data.deposit)*(usdValue);
                      Stake.find({m_stake_id:mvault_data._id}, function(err, docs){
                        var total_interest=0;
                        var total_current=0;
                        var total_current_usd=0;
                        var total_withdrawn =0;
                        for(var u=0;u<docs.length;u++){
                          if(docs[u].type!="withdrawl"){
                            total_interest=(parseFloat(total_interest))+(parseFloat(docs[u].interest_earned));
                            total_current=(parseFloat(total_current))+(parseFloat(docs[u].current_coin_balance));
                          }else{
                            total_withdrawn = (parseFloat(total_withdrawn) + parseFloat(docs[u].withdrawal));
                          }
                        }
                        // total_current_usd= (total_current)*(usdValue);
                        // console.log("rowanvault",user_id)
                        // console.log("success withdrawn ", total_withdrawn)
                        page_data=docs;
                        const vault_list = paginate(page_data,page, perPage);
                        res.json({status:1,msg:"success",data:{rules,total_balance:rown_bal,total_usd,total_interest:total_interest,total_current,total_withdrawn,user_passphrase:wallet_details.passphrase,stake_data: vault_list}});
                        // res.render('front/comingsoon',{total_balance:rown_bal,current_balance:count_balance,total_usd,current_usd:current_usd,users: docs,mvault_data,moment,err_msg,success_msg,interest,total_interest:usd_balance,total_current_usd,total_current,total_withdrawn});
                      });
                    }else{
                      res.json({status:1,msg:"success",data:{rules,total_balance:rown_bal,total_usd,total_interest:'0',total_current:'0',total_withdrawn:'0',user_passphrase:wallet_details.passphrase,stake_data:""}});
                      // res.render('front/comingsoon',{total_balance:rown_bal,current_balance:count_balance,total_usd,current_usd:current_usd,users:"",mvault_data,moment,err_msg,success_msg,interest,total_interest:'0',total_current_usd:'0',total_current:'0',total_withdrawn:'0'});
                    }
                  })  
                });
              }
            });
          }
          else
          {
            res.json({status:0,msg:"failed",data:'Sorry!, please import or create a wallet first.'});
            // req.flash('err_msg', 'Sorry!, please import or create a wallet first.');
            // res.redirect('/Dashboard');
          }
        }
      }); 
    })
  })    //ROWAN SHOW END**
})


app.post('/api/stakeByDate',(req,res,next) =>{
  var min_date = req.body.getMinDate;
  var max_date = req.body.getMaxDate;
  // console.log("mindate ",min_date ," maxdate ",max_date)
  var page = req.query.page || 1
  var perPage = 10;
  var page_data=[]
  var min = moment(new Date(min_date)).format('M/D/YYYY');//moment(startdate).format('M/D/YYYY, hh:mm:ss')
  var max = moment(new Date(max_date)).format('M/D/YYYY');
  var user_id=req.body.user_id;

  MainStake.findOne({user_id:user_id}).then(mvault_data =>{
    if(mvault_data){
      Stake.find({m_stake_id:mvault_data._id,created_at:{$gte:min+', 00:00:00',$lte:max+', 23:59:59'}}, function(err, docs){
        page_data=docs;
        const vault_list = paginate(page_data,page, perPage);
        res.json({status:1,msg:"success",data:{stake_data:vault_list}})
      });
    }else{
      res.json({status:1,msg:"success",data:{stake_data:""}})
    }           
  })       
})


app.post('/api/check_stake_deposit', async (req,res) => {
  var user_id = req.body.user_id;
  await Tokensettings.findOne().then(async values => {
    var usdValue = values.usdValue;
    await Importwallet.findOne({'user_id': user_id,'login_status':'login'},async function(err,loginwallet){
      if(loginwallet && loginwallet!="" && loginwallet!=null && loginwallet!=undefined){
        if (err) {
          res.json({status:0,msg:"failed",data:'Something is worng.'});
        }else{
          if(loginwallet !="" && loginwallet!=undefined)
          {
            await Userwallet.findOne({'_id': loginwallet.wallet_id},async function(err,result){
            if (err) {res.json({status:0,msg:"failed",data:'Something is worng.'});}
            else{ 
                wallet_details=result;
                var tokenContract = new web3js.eth.Contract(tokenContractABI,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                tokenContract.methods.balanceOf(wallet_details.wallet_address).call().then(async function (result) {
                  var count_balance = parseInt(result);
                  rown_bal=count_balance/Math.pow(10,7);
                  var total_usd = (rown_bal)*(usdValue);
                  if(parseFloat(rown_bal)<6000){
                    // req.flash('err_msg', "You should have atleast $100 equivalent ARTW in your wallet.");
                    // res.redirect('/rowanvault'); 
                    res.json({status:0,msg:"failed",data:'You should have atleast 6000 ARTW in your wallet.'});
                   }else{
                    res.json({status:1,msg:"success",data:{user_passphrase:wallet_details.passphrase}});
                   }
                })
              }
            })
          }
        }
      }else{
        res.json({status:0,msg:"failed",data:'Please create/import your wallet first.'});
      }  
    })  
  })
})


app.post('/api/stake-deposit', async function(req, res){
  var user_id=req.body.user_id;
  var expiry_period=await calculateDays(new Date(),new Date(req.body.endate));
  console.log("expiry_period",expiry_period);
  await StakeRate.findOne().then(async(SetVaultData)=>{
    await Tokensettings.findOne({}).then(async rwn_value =>{
      var usd = rwn_value.usdValue;
      var check_amnt = (req.body.startingbalance)*(usd);
      if(parseInt(expiry_period)<28){
        res.json({status:0,msg:"failed",data:'Expiry period should be atleast a month.'});
        // req.flash('err_msg', "Expiry period should be atleast a month.");
        // res.redirect('/depo');
      }else{
        var user_correct_passphrese=req.body.user_passphrase.trim();
        var entered_passphrese=req.body.entered_passphrase.trim();
        var hashnew=crypto.createHash('sha256').update(entered_passphrese).digest('base64');
        
        var sender_address=req.body.sender_address.trim();
        var reciver_address='0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE';
        var get_amount=req.body.startingbalance.trim();

        var wallet_id=req.body.get_wallet_id.trim();
        if(user_correct_passphrese==hashnew)
        {
          var options = {  
            url: "http://3.137.11.222:8502",
            method: 'POST',
            headers:
            { 
              "content-type": "application/json"
            },
            body: JSON.stringify({"jsonrpc":"2.0","method":"personal_unlockAccount","params":[sender_address,entered_passphrese],"id":1})
          };
          request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var options4 = {  
                url: "http://3.137.11.222:8502",
                method: 'POST',
                headers:
                { 
                  "content-type": "application/json"
                },
                body: JSON.stringify({"jsonrpc":"2.0","method":"personal_listWallets","params":[],"id":1})
              };
              request(options4, function (error, response, body) {
                var c = JSON.parse(body).result;
                c.forEach(function(element) {
                  var accounts_details = element.accounts;
                  accounts_details.forEach(function(element1) {
                    if (element1.address==sender_address) {
                      var parts = element1.url.split('/');
                      var lastSegment = parts.pop() || parts.pop();  
                      console.log("lastSegment",lastSegment);
                      var options6 = {
                        url: `http://3.137.11.222/devnetwork/node2/keystore/${lastSegment}`,
                        method: 'GET',
                        headers:{
                          "content-type": "application/json"
                        }
                      }
                      request(options6, function (error, response, body) {
                        console.log("error",error);
                        console.log("body",body);
                        if (!error && response.statusCode == 200) {
                          var options = {  
                            url: "http://3.137.11.222:8502",
                            method: 'POST',
                            headers:
                              { 
                                "content-type": "application/json"
                              },
                            body: JSON.stringify({"jsonrpc":"2.0","method":"clique_getSigners","params":[],"id":1})
                          };
                          request(options, function (error5, response5, body5) {
                            console.log("error5",error5);
                            console.log("body5",body5);
                            if (!error5 && response5.statusCode == 200) {
                              var validators=JSON.parse(body5);
                              var all_validators=validators.result;
                              console.log("inside"+all_validators);
                              var csv = body;
                              console.log(csv)  
                              var c =  web3js.eth.accounts.decrypt(csv,entered_passphrese);
                              console.log(c.privateKey);
                              var pk = c.privateKey.slice(2);
                              var sender_private_key=pk;
                              var privateKey = Buffer.from(sender_private_key, 'hex');
                              console.log("private key",privateKey);
                              var user1=tokenContractABI;
                              var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                              var count;
                              tokenContract.methods.balanceOf(sender_address).call().then(function (result) {
                                console.log("---------------------------------",result);
                                var count_balance = parseInt(result);
                                rown_bal=count_balance/Math.pow(10,7);
                                console.log("total balance "+rown_bal);
                                console.log("user enter amount "+get_amount)
                                var gas_amount=parseFloat(get_amount)+parseFloat(0.0000001);
                                console.log("add "+parseFloat(gas_amount));
                                if(rown_bal >= gas_amount)
                                { 
                                  web3js.eth.getTransactionCount(sender_address).then(function(v) {
                                    console.log("Count: " + v);
                                    count = v;
                                    var amount = get_amount;
                                    // var rawTransaction = {"from":myAddress, "gasPrice":web3.utils.toHex(2 * 1e9),"gasLimit":web3.utils.toHex(210000),"to":contractAddress,"value":"0x0","data":contract.methods.transfer(toAddress, amount).encodeABI(),"nonce":web3.utils.toHex(count)} 
                                    var array_donation= [];
                                    var rawTransaction = {
                                      "from": sender_address,
                                      "gasPrice": '0x0',
                                      "gasLimit": web3js.utils.toHex(4600000),
                                      "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
                                      "value": "0x0",
                                      "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7),array_donation,'0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
                                      "nonce": web3js.utils.toHex(count)
                                    }
                                    // console.log(rawTransaction);
                                    var transaction = new Tx(rawTransaction);
                                    transaction.sign(privateKey);
                                    web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
                                      if (err) 
                                        // if(err)
                                      {
                                        // console.log(hash);
                                        res.json({status:0,msg:"failed",data:'Something is worng.'});
                                        // req.flash('err_msg', "Connection error, please retry your deposit.");
                                        // res.redirect('/rowanvault');  
                                      } 
                                      else { 
                                        var rwn = req.body.startingbalance;
                                        var usdValue = (parseFloat(usd))*(parseFloat(rwn));
                                        var startdate = new Date();
                                        var endate= new Date(req.body.endate);
                                        MainStake.findOne({user_id:user_id}).then(async mvault_data =>{ 
                                          if(mvault_data==null){
                                            new MainStake({
                                              user_id:user_id,
                                              created_at:moment(startdate).format('M/D/YYYY, hh:mm:ss')   
                                            }).save(function(err, doc){
                                                // console.log("success")
                                              if(err) {res.json(err);}
                                              else{
                                                new Stake({
                                                  m_stake_id:doc._id,
                                                  startingbalance : req.body.startingbalance,
                                                  valueinUSD:usdValue,
                                                  startdate:moment(startdate).format('M/D/YYYY, hh:mm:ss'),
                                                  deposit:rwn,
                                                  closingbalance:'0',
                                                  closingbalanceUSD:'0',
                                                  interest_earned:'0',
                                                  interestinUSD: '0',
                                                  withdrawal:'0',
                                                  enddate:moment(endate).format('M/D/YYYY, hh:mm:ss'),
                                                  current_coin_balance:rwn,
                                                  valueinUSD_current:usdValue,
                                                  interest_rate:SetVaultData.interest_rate,
                                                  created_at:moment(startdate).format('M/D/YYYY, hh:mm:ss'),
                                                  type:"deposit"          
                                                }).save(function(err, new_vault){
                                                  if(err){
                                                    res.json(err);
                                                  }else{
                                                    console.log("success new method",new_vault)
                                                    res.json({status:1,msg:"success",data:'Amount deposited successfully.'});
                                                    // req.flash('success_msg', 'Amount deposited successfully.');
                                                    // res.redirect('/rowanvault');
                                                  }
                                                });
                                              }
                                            });
                                          }else{
                                            // var new_depo = parseFloat(rwn) + parseFloat(mvault_data.deposit);
                                            await MainStake.updateOne({user_id:user_id}, {$set: { updated_at:startdate  }}, {upsert: true}, function(err){
                                              if (err){
                                                res.json({status:0,msg:"failed",data:'Something is worng.'});
                                                // req.flash('err_msg', 'Sorry!, please try again.');
                                                // res.redirect('/rowanvault');
                                              } else 
                                              { 
                                                new Stake({
                                                  m_stake_id:mvault_data._id,
                                                  startingbalance : req.body.startingbalance,
                                                  valueinUSD:usdValue,
                                                  startdate:moment(startdate).format('M/D/YYYY, hh:mm:ss'),
                                                  deposit:rwn,
                                                  closingbalance:'0',
                                                  closingbalanceUSD:'0',
                                                  interest_earned:'0',
                                                  interestinUSD: '0',
                                                  withdrawal:'0',
                                                  enddate:moment(endate).format('M/D/YYYY, hh:mm:ss'),
                                                  current_coin_balance:rwn,
                                                  valueinUSD_current:usdValue,
                                                  interest_rate:SetVaultData.interest_rate,
                                                  created_at:moment(startdate).format('M/D/YYYY, hh:mm:ss') ,
                                                  type:"deposit"         
                                                }).save(function(err, new_vault){
                                                    // console.log("success")
                                                  if(err){
                                                    res.json(err);
                                                  }else{
                                                    console.log('new_vault************** ',new_vault);
                                                    res.json({status:1,msg:"success",data:'Amount deposited successfully.'});
                                                    // req.flash('success_msg', 'Amount deposited successfully.');
                                                    // res.redirect('/rowanvault');
                                                  }
                                                }); 
                                              }
                                            })
                                          }
                                        })   
                                      }
                                    }).on('transactionHash');
                                  });
                                }
                                else
                                {
                                  res.json({status:0,msg:"failed",data:'Insufficient funds In Your account.'});
                                  // req.flash('err_msg', "Insufficient funds In Your account.");
                                  // res.redirect('/rowanvault');
                                }
                              });
                            } 
                          });  
                        }
                      });
                    }
                  });
                });
              });
            }
            else{
              res.write(response.statusCode.toString() + " " + error);
            }
          });
        }
        else
        {
          res.json({status:0,msg:"failed",data:'Please enter valid passphrase.'});
          // req.flash('err_msg', 'Please enter valid passphrase.');
          // res.redirect('/depo');
        }
      }
    });
  })
})  
  

app.post('/api/check_stake_withdrawl', function(req, res) { 
  var user_id=req.body.user_id;
  var id = req.body.vault_id;
  StakeRate.findOne({}).then(interest =>{
    Tokensettings.findOne({}).then(rwn_value =>{
      MainStake.findOne({user_id:user_id}).then(mvault_data =>{
        var usdValue = rwn_value.usdValue;
        Importwallet.findOne({'user_id': user_id,'login_status':'login'},function(err,loginwallet){
          if (err) {
            res.json({status:0,msg:"failed",data:'Something is worng.'});
          }
          else{
            if(loginwallet !="" && loginwallet!=undefined)
            {
              Userwallet.findOne({'_id': loginwallet.wallet_id},function(err,result){
                if (err) {res.json({status:0,msg:"failed",data:'Something is worng.'});}
                else{ 
                  wallet_details=result;
                  import_wallet_id=loginwallet._id;
                  var options = {  
                    url: "http://3.137.11.222:8502",
                    method: 'POST',
                    headers:
                    { 
                      "content-type": "application/json"
                    },
                    body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getBalance","params":[wallet_details.wallet_address,"latest"],"id":1})
                  };
                  request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      // console.log(body);
                      var get_bal=JSON.parse(body);
                      var total_bal=get_bal.result;
                      var count_balance = parseInt(total_bal);
                      // var balance=count_balance;
                      var balance=count_balance/Math.pow(10,18)
                      var user1=tokenContractABI;
                      var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719"); 
                      tokenContract.methods.balanceOf(wallet_details.wallet_address).call().then(function (result) {
                        var count_balance = parseInt(result);
                        rown_bal=count_balance/Math.pow(10,7);
                        var total_usd = (rown_bal)*(usdValue);
                        Stake.findOne({'_id' : id}).then(object =>{
                        //  console.log("valult *********** ",object);
                          Stake.find({'m_stake_id' : object.m_stake_id}).then(async objects =>{
                            var total_interest=0;
                            var total_current=0;
                            var rwn_interest;
                            var total_withdrawn =0;
                            var total_current_usd=0;
                            for(var u=0;u<objects.length;u++){
                              if(objects[u].type!="withdrawl"){
                              // console.log("valult ***********123 ",objects[u]);
                              total_interest=(parseFloat(total_interest))+(parseFloat(objects[u].interest_earned));
                              total_current=(parseFloat(total_current))+(parseFloat(objects[u].current_coin_balance));
                              }else{
                                total_withdrawn = (parseFloat(total_withdrawn) + parseFloat(objects[u].withdrawal));
                              }
                            }
                            //  console.log("usd_balance ",usd_balance);
                            rwn_interest= object.interest_earned
                            //  total_current_usd= (total_current)*(usdValue);
                            if(object !== null){
                              var expiry_period= calculateDays(new Date(moment(new Date()).format('M/D/YYYY, hh:mm:ss')),new Date(object.enddate));
                              console.log("enddate------------ ",new Date(object.enddate));
                              console.log("today------------ ",new Date(moment(new Date()).format('M/D/YYYY, hh:mm:ss')));
                              console.log("expiry_period------------ ",expiry_period);
                              if(parseInt(expiry_period)<0 || parseInt(expiry_period)==0){
                                if(parseFloat(rwn_interest)<1000){
                                  res.json({status:0,msg:"failed",data:'You should have atleast 1000 ARTW as interest.'});
                                  // req.flash('err_msg', "You should have atleast $10 equivalent of ARTW tokens as interest.");
                                  // res.redirect('/rowanvault'); 
                                }else{
                                  var rwn = object.current_coin_balance;
                                  var current_usd = object.valueinUSD_current;
                                  console.log("object ",total_usd);
                                  res.json({status:1,msg:"success",data:{stake_id:object._id,current_balance:object.current_coin_balance,total_usd,current_usd,total_balance:rown_bal,usdValue,wallet_id:loginwallet.wallet_id,wallet_address:wallet_details.wallet_address,passphrase:wallet_details.passphrase,total_interest:total_interest,total_current_usd,total_current,rwn,total_withdrawn}});
                                  // res.render('front/withdrawl',{object,current_balance:object.current_coin_balance,total_usd,current_usd,total_balance:rown_bal,mvault_data,usdValue,wallet_id:loginwallet.wallet_id,wallet_address:wallet_details.wallet_address,passphrase:wallet_details.passphrase,err_msg,success_msg,interest,total_interest:usd_balance,total_current_usd,total_current,rwn,total_withdrawn});
                                }
                              }else{
                                res.json({status:0,msg:"failed",data:'You can withdraw only after your deposit expiry date.'});
                                // req.flash('err_msg', "You can withdraw only after your deposit expiry date.");
                                // res.redirect('/rowanvault');
                              }
                            }
                          }) 
                        })
                      });
                    }else{
                      res.json({status:0,msg:"failed",data:'Something is worng.'});
                      // console.log(error);
                      // console.log("get balance api is not working");
                    }
                  });
                }
              });
            }
          }
        }); 
      }) 
    })
  })    
})


app.post('/api/stake-withdraw', async function(req, res){
  var id = req.body.vault_id;
  var withdrawl_amount= req.body.current_coin_balance;
	var user_id=req.body.user_id.trim();

	var sender_address='0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE';
	var reciver_address=req.body.reciver_address.trim();
  var get_amount=req.body.current_coin_balance.trim();
  
  var entered_passphrese = 'Pass@node2 _ArtW';

  await Stake.find({_id : id}).then(async amount_check =>{
    if(parseFloat(get_amount)<=parseFloat(amount_check[0].current_coin_balance)){
      var options = {  
        url: "http://3.137.11.222:8502",
        method: 'POST',
        headers:
        { 
         "content-type": "application/json"
        },
        body: JSON.stringify({"jsonrpc":"2.0","method":"personal_unlockAccount","params":[sender_address,entered_passphrese],"id":1})
      };
      await request(options, function (error, response, body) {
        console.log("----------",error);
        if (!error && response.statusCode == 200) {
          console.log(body);
          var options = {  
            url: "http://3.137.11.222:8502",
            method: 'POST',
            headers:
            { 
              "content-type": "application/json"
            },
            body: JSON.stringify({"jsonrpc":"2.0","method":"clique_getSigners","params":[],"id":1})
          };
          request(options, function (error5, response5, body5) {
            if (!error5 && response5.statusCode == 200) {
              var validators=JSON.parse(body5);
              var all_validators=validators.result
              var sender_private_key='0de3838ca99bd85255bc630733f7d72484508cc3a8cd9c03a59d6d97aa9bf83b';
              var privateKey = Buffer.from(sender_private_key, 'hex');
              var user1=tokenContractABI;
              var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
              var count;
              var array_donation = [];

              tokenContract.methods.balanceOf(sender_address).call().then(function (result) {
                var count_balance = parseInt(result);
                rown_bal=count_balance/Math.pow(10,7);
                console.log(rown_bal);
                if(rown_bal >= get_amount)
                { 
                  web3js.eth.getTransactionCount(sender_address).then(ex =>{
                  console.log("exxxxxxxxxxxx",ex);
                  })
                  web3js.eth.getTransactionCount(sender_address).then(function(v) {
                    console.log("Count: " + v);
                    count = v;
                    console.log("Count: " + count);
                    var amount = Math.round(get_amount*1000)/1000;
                    var rawTransaction = {
                      "from": sender_address,
                      "gasPrice": '0x0',
                      "gasLimit": web3js.utils.toHex(4600000),
                      "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
                      "value": "0x0",
                      "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7),array_donation,'0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
                      "nonce": web3js.utils.toHex(count)
                    }
                    var transaction = new Tx(rawTransaction);
                    transaction.sign(privateKey);
                    web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
                      console.log("errrrrrrrrrrrrrrrrrrrr",err);
                      if (hash !="" && hash!=null && hash!=undefined) 
                      {
                        Tokensettings.findOne({}).then(async rwn_value =>{
                          var usd = rwn_value.usdValue;
                          await Stake.findOne({_id : id}).then(async ob =>{ 
                            var current_b = parseFloat(ob.current_coin_balance) - parseFloat(withdrawl_amount) ;
                            var withdr = parseFloat(ob.withdrawal) + parseFloat(withdrawl_amount);
                            var valueinUSD_current = parseFloat(usd) * parseFloat(current_b);
                            // console.log("---------------- ",ob);
                            var sb= ob.current_coin_balance;
                            var date= ob.startdate;
                            var d = ob.days;
                            var rwn = ob.startingbalance;
                            var int_usd = ob.interestinUSD;
                            var usdValue = parseFloat(usd) * parseFloat(rwn);
                            var crdate= new Date();
                            await Stake.updateOne({_id : id},{$set: { current_coin_balance: current_b,valueinUSD_current:valueinUSD_current,updated_at:crdate  }}, {upsert: true},async function(err){
                              if (err){
                                res.json({status:0,msg:"failed",data:'Something is worng.'});
                                // req.flash('err_msg', 'Sorry!, please try again.');
                                // res.redirect('/rowanvault');
                              } else 
                              {
                                await MainStake.findOne({_id:ob.m_stake_id}).then(async m_vault =>{
                                  // var new_depo = parseFloat(m_vault.deposit)-parseFloat(withdrawl_amount);
                                  await MainStake.updateOne({_id:ob.m_stake_id}, {$set: {  updated_at:crdate  }}, {upsert: true}, function(err){
                                    if (err){
                                      res.json({status:0,msg:"failed",data:'Something is worng.'});
                                      // req.flash('err_msg', 'Sorry!, please try again.');
                                      // res.redirect('/rowanvault');
                                    } else 
                                    { 
                                      new Stake({
                                        m_stake_id:ob.m_stake_id,
                                        startingbalance :sb,
                                        closingbalance:current_b,
                                        closingbalanceUSD:valueinUSD_current,
                                        valueinUSD:usdValue,
                                        startdate:date,
                                        days:d,
                                        deposit:ob.deposit,
                                        interest_earned:ob.interest_earned,
                                        interestinUSD: int_usd,
                                        withdrawal:withdr,
                                        enddate:ob.enddate,
                                        current_coin_balance:current_b,
                                        valueinUSD_current:valueinUSD_current,
                                        created_at:moment(crdate).format('M/D/YYYY, hh:mm:ss'),
                                        type:"withdrawl"      
                                      }).save(function(err, doc){
                                        console.log("successs")
                                        if(err) res.json(err);
                                        else {   
                                          res.json({status:1,msg:"success",data:'Successfully withdrawn.'});
                                          // req.flash('success_msg', "Successfully withdrawn.");
                                          // res.redirect('/rowanvault');
                                        }
                                      });
                                    }
                                  })
                                })
                              }
                            })
                          });
                        })
                      } 
                      else { 
                        res.json({status:0,msg:"failed",data:'Something is worng.'});
                        // req.flash('err_msg', "Connection error, please retry your deposit.");
                        // res.redirect('/withdrawl'); 

                      }
                    })
                  });
                }
                else
                {
                  res.json({status:0,msg:"failed",data:'Insufficient funds in account.'});
                  // req.flash('err_msg', "Insufficient funds in account.");
                  // res.redirect('/withdrawl'); 
                }
              });
            }
          });
        }
        else{
          res.write(response.statusCode.toString() + " " + error);
        }
      });
    }else{
      res.json({status:0,msg:"failed",data:'Insufficient funds staked.'});
      // req.flash('err_msg', "Insufficient funds in Your vault.");
      // res.redirect('/withdrawl'); 
    }
  })
})  


app.post('/api/check_stake_reinvest', async (req,res) => {
  var id = req.body.vault_id;
  var user_id = req.body.user_id;
  Stake.findOne({_id:id}).then(vault_data =>{
    StakeRate.findOne({}).then(interest =>{
      Tokensettings.findOne({}).then(async rwn_value =>{
        var usdValue = rwn_value.usdValue;
        var current_coin_usd = (vault_data.current_coin_balance)*(usdValue)
        var current_interest = (vault_data.interest_earned)*(usdValue);
        var expiry_period=calculateDays(new Date(),new Date(vault_data.enddate));
        if(parseInt(expiry_period)<0){
          // if(parseFloat(current_interest)>10){
          console.log("reinvest logic");
          await Importwallet.findOne({'user_id': user_id,'login_status':'login'},function(err,loginwallet){
            if (err) {
              res.json({status:0,msg:"failed",data:'Something is worng.'});
            }
            else{
              if(loginwallet !="" && loginwallet!=undefined)
              {
                Userwallet.findOne({'_id': loginwallet.wallet_id},function(err,result){
                  if (err) {res.json({status:0,msg:"failed",data:'Something is worng.'});}
                  else{ 
                    wallet_details=result;
                    import_wallet_id=loginwallet._id;
                    var user1=tokenContractABI;
                    // console.log("ABI",user1);      
                    var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
                    tokenContract.methods.balanceOf(wallet_details.wallet_address).call().then(function (result) {
                      var count_balance = parseInt(result);
                      rown_bal=count_balance/Math.pow(10,7);
                      var total_usd = (rown_bal)*(usdValue);
                      MainStake.findOne({'_id' : vault_data.m_stake_id}).then(mvault_data =>{
                          //  console.log("valult *********** ",object);
                        var current_usd = vault_data.valueinUSD_current;
                        var rwn = vault_data.current_coin_balance;
                        Stake.find({'m_stake_id' : vault_data.m_stake_id}).then(objects =>{
                          var total_interest=0;
                          var total_current=0;
                          var usd_interest;
                          var total_withdrawn=0;
                          var total_current_usd=0;
                          for(var u=0;u<objects.length;u++){
                            if(objects[u].type!="withdrawl"){
                              // console.log("valult ***********123 ",objects[u]);
                              total_interest=(parseFloat(total_interest))+(parseFloat(objects[u].interest_earned));
                              total_current=(parseFloat(total_current))+(parseFloat(objects[u].current_coin_balance));
                            }else{
                              total_withdrawn = (parseFloat(total_withdrawn) + parseFloat(objects[u].withdrawal));

                            }
                          }
                            //  console.log("usd_balance ",usd_balance);
                            //  usd_interest= (vault_data.interest_earned)*(usdValue);
                            //total_current_usd= (total_current)*(usdValue);
                          if(vault_data !== null){
                            console.log("object ",total_usd);
                            res.json({status:1,msg:"success",data:{vault_data,usdValue,current_balance:vault_data.current_coin_balance,total_usd,current_usd,current_coin_usd,total_balance:rown_bal,wallet_id:loginwallet.wallet_id,wallet_address:wallet_details.wallet_address,passphrase:wallet_details.passphrase,total_interest:total_interest,total_current_usd,total_current,rwn,total_withdrawn}});
                            // res.render('front/reinvest',{vault_data,usdValue,interest,current_balance:vault_data.current_coin_balance,total_usd,current_usd,current_coin_usd,total_balance:rown_bal,mvault_data,wallet_id:loginwallet.wallet_id,wallet_address:wallet_details.wallet_address,passphrase:wallet_details.passphrase,err_msg,success_msg,total_interest:usd_balance,total_current_usd,total_current,rwn,total_withdrawn});
                          }
                        }) 
                      })
                    });
                  }
                });
              }
            }
          });
        }else{
          res.json({status:0,msg:"failed",data:'You can reinvest only after deposit expiry date.'});
          // req.flash('err_msg', "You can reinvest only after deposit expiry date.");
          // res.redirect('/rowanvault');
        }
      })
    })
  }).catch(err =>{

  })
})


app.post('/api/stake-reinvest', async function(req, res){

  var vault_id = req.body.vault_id;
  var user_id=req.body.user_id;
  var expiry_period=await calculateDays(new Date(),new Date(req.body.endate));
  console.log("expiry_period",expiry_period);
  await StakeRate.findOne().then(async(SetVaultData)=>{
    await Tokensettings.findOne({}).then(async rwn_value =>{
      var usd = rwn_value.usdValue;
      var check_amnt = (req.body.startingbalance)*(usd);
      if(parseInt(expiry_period)<28){
        res.json({status:0,msg:"failed",data:'Expiry period should be atleast a month.'});
        // req.flash('err_msg', "Expiry period should be atleast a month.");
        // res.redirect('/reinvest?id='+vault_id);
      }else{
        var rwn = req.body.startingbalance;
        var usdValue = (parseFloat(usd))*(parseFloat(rwn));
        var startdate = new Date();
        var endate= new Date(req.body.endate);                             
        await MainStake.findOne({user_id:user_id}).then(async mvault_data =>{ 
          await Stake.findOne({_id:vault_id}).then(async vault_data =>{ 
            await MainStake.updateOne({user_id:user_id}, {$set: { updated_at:startdate  }}, {upsert: true}, function(err){
              if (err){
                res.json({status:0,msg:"failed",data:'Something is worng.'});
                // req.flash('err_msg', 'Sorry!, please try again.');
                // res.redirect('/reinvest?id='+vault_id);
              } else { 
                new Stake({
                  m_stake_id:mvault_data._id,
                  startingbalance : req.body.startingbalance,
                  valueinUSD:usdValue,
                  startdate:moment(startdate).format('M/D/YYYY, hh:mm:ss'),
                  deposit:rwn,
                  closingbalance:'0',
                  closingbalanceUSD:'0',
                  interest_earned:'0',
                  interestinUSD: '0',
                  withdrawal:'0',
                  enddate:moment(endate).format('M/D/YYYY, hh:mm:ss'),
                  current_coin_balance:vault_data.current_coin_balance,
                  valueinUSD_current:vault_data.valueinUSD_current,
                  interest_rate:SetVaultData.interest_rate,
                  created_at:moment(startdate).format('M/D/YYYY, hh:mm:ss') ,
                  type:"reinvest"         
                }).save( function(err, new_vault){
                  if(err){
                    res.json(err);
                  }else{
                    Stake.updateOne({_id:vault_id}, {$set: { current_coin_balance:'0',valueinUSD_current:'0',updated_at:startdate  }}, {upsert: true}, function(err){
                      if (err){
                        res.json({status:0,msg:"failed",data:'Something is worng.'});
                        // req.flash('err_msg', 'Sorry!, please try again.');
                        // res.redirect('/reinvest?id='+vault_id);
                      } else { 
                        res.json({status:1,msg:"success",data:'Amount reinvested successfully.'});
                        // console.log('new_vault************** ',new_vault);
                        // req.flash('success_msg', 'Amount reinvested successfully.');
                        // res.redirect('/rowanvault');
                      } 
                    })
                  }
                }); 
              }
            })        
          })   
        })
      }
    });
  })
}) 




// app.get('/change-date', (req,res) => {
//   VAULT.find({}).then(all_vault => {
//     for(var i=0; i<all_vault.length; i++){
//       var d = new Date();
//       d.setDate(d.getDate()-2);
//       var gap = calculateDays(d,new Date(all_vault[i].enddate));
     
//       if(parseFloat(all_vault[i].current_coin_balance) < parseFloat(all_vault[i].startingbalance) && parseInt(gap)>0 && all_vault[i].type != "withdrawl"){
//         if(parseInt(all_vault[i].current_coin_balance)<3){
//           VAULT.updateOne({_id:all_vault[i]._id}, {$set: { enddate:moment(d).format('M/D/YYYY, hh:mm:ss'), days:gap  }}).then(success => {
//           console.log("vault data ",i," gap ",gap," current balance ",all_vault[i].current_coin_balance);

//           }).catch(err => {

//           })
//         }
//       }
//     }
//   })
// })


// app.get('/change-USD', (req,res) => {
//   VAULT.find().then(all_vault => {
//     for(var i=0; i<all_vault.length; i++){
//       var d = new Date();
//       d.setDate(d.getDate()-2);
//       var gap = calculateDays(d,new Date(all_vault[i].enddate));
//       if(all_vault[i].type != "withdrawl"){
//         if(parseInt(gap)>0){
//           var valueinUSD = parseFloat(all_vault[i].valueinUSD)
//           var interestinUSD = parseFloat(all_vault[i].interestinUSD)
//           var current_coin_balance = parseFloat(all_vault[i].startingbalance)+parseFloat(all_vault[i].interest_earned)

//           var valueinUSD_current = parseFloat(valueinUSD)+parseFloat(interestinUSD)
//           // var closingbalanceUSD = parseFloat(all_vault[i].closingbalance)*(0.015)
//           VAULT.updateOne({_id:all_vault[i]._id}, {$set: { current_coin_balance:current_coin_balance, closingbalance:current_coin_balance, closingbalanceUSD:valueinUSD_current, valueinUSD_current:valueinUSD_current  }}).then(success => {
//             console.log("vault data ",i," gap ",gap," current balance ",all_vault[i].current_coin_balance);

//           }).catch(err => {

//           })
//         }else{
         
//         }
//       }  
//     }
//   })
// })



// app.get('/save-balances', async (req,res,next) => {
//   await LATokenBalnce.find().then(async all_addresses => {
//         for(var i =0;i<all_addresses.length;i++){
//         //   if(all_addresses[i].balance){
//             // console.log("if ",i);
//           var user1=tokenContractABI;  
//           var address = all_addresses[i].wallet_address;
//           var tokenContract = new web3js.eth.Contract(user1,"0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
        
//             await tokenContract.methods.balanceOf(address).call().then(async function (result) {
            
//               var count_balance = parseInt(result);
//               rown_bal=count_balance/Math.pow(10,7);  
//               await LATokenBalnce.updateOne({_id:all_addresses[i]._id},{$set:{balance:rown_bal}}).then(success =>{
//                console.log("rown_bal ",rown_bal,"-------- ",i);
//               }).catch(err1 => {
//                 console.log(err1);
//               })
              
//             }).catch(err2 => {
//               console.log(err2);
//             })
//         //   }else{
            
//         //   }
          
//         }
//       }) 
// })



module.exports = app;
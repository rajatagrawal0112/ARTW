// const nodemailer = require("nodemailer");

// async function mail(to_mail, mail_subject, mail_content) {

//     const mailOptions = {
//         to: to_mail,
//         from: 'rajatagrawal@questglt.org',
//         subject: mail_subject,
//         html: mail_content
//     };

//     const smtpTransport = nodemailer.createTransport({
//         // host: 'smtp.zoho.in',
//         // port: 465,
//         // secure: true,
//         // auth: {
//         //     user: 'marketing@theartw.com',
//         //     pass: 'fDiG4jxUIGP7'
//         // }
//         service: 'gmail',
//         auth: {
//             user: 'rajatagrawal@questglt.org',
//             pass: 'QuestRajat@123'
//         }
//     });

//     return new Promise((resolve, reject) => {
//         smtpTransport.sendMail(mailOptions, function (err, result) {
//             if (err) {
//                 console.log(err)
//                 reject(0);
//             }
//             else {
//                 resolve(1)
//             }
//         })
//     })
// }

// module.exports = {
//     mail,
// }


const nodemailer = require("nodemailer");

async function mail(to_mail, mail_subject, mail_content) {

    const mailOptions = {
        to: to_mail,
        from: 'shanakhan@questglt.org',
        subject: mail_subject,
        html: mail_content
    };

    const smtpTransport = nodemailer.createTransport({
        // host: 'smtp.zoho.in',
        // port: 465,
        // secure: true,
        // auth: {
        //     user: 'marketing@theartw.com',
        //     pass: 'fDiG4jxUIGP7'
        // }
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'shanakhan@questglt.org',
            pass: 'MomDad@789'
        }
    });

    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, function (err, result) {
            if (err) {
                console.log(err)
                reject(0);
            }
            else {
                resolve(1)
            }
        })
    })
}

module.exports = {
    mail,
}
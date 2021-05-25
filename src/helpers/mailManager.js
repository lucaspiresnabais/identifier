const nodemailer = require('nodemailer');
const path = require('path')

async function sendMail(data, mail) { 
    const { imageName, link} = data
    let testAccount = await nodemailer.createTestAccount()

    let transporter = await nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
        },
    })

    let info; 
    if (imageName) {
        
        const imagePath = path.join(`${__dirname}/../public/images/${imageName}`)
    
        info = await transporter.sendMail({
            from: '"Lucas" <lucas@example.com>', // sender address
            to: mail, // list of receivers
            subject: "Tu QR", // Subject line
            text: "Acá abajo debe aparecer un QR", // plain text body
            html: '<img src="cid:b" alt="Header Image" width="100" height="100"/>', // html body
            attachments: [{
                filename: imageName,
                path: imagePath,
                cid: 'lucaspiresnabais2'
            }]
        });
    } else {
        info = await transporter.sendMail({
            from: '"Lucas" <lucas@example.com>', // sender address
            to: mail, // list of receivers
            subject: "Tu link", // Subject line
            text: `Link al scanner: ${link}`, // plain text body
        });
    }
    
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {sendMail};
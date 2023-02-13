const nodemailer = require("nodemailer")

const sendEmail = async (user, pass, emailObject) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: user,
            pass: pass
        },
    })

    let info = await transporter.sendMail(emailObject)

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    return info.messageId
}

module.exports = sendEmail
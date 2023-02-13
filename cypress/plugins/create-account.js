const nodemailer = require("nodemailer")

const createAccount = async () => {
    let testAccount
    testAccount = await nodemailer.createTestAccount()
    console.log("created new email account %s", testAccount.user)
    console.log("for debugging, the password is %s", testAccount.pass)

    return testAccount
}

module.exports = createAccount
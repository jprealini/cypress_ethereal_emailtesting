// use Nodemailer to get an Ethereal email inbox
// https://nodemailer.com/about/
const nodemailer = require("nodemailer")
// used to fetch emails from the inbox via imap protocol
// https://github.com/postalsys/imapflow
const { ImapFlow } = require("imapflow")

const getLastEmail = async (user, pass) => {
    debugger
    let client = new ImapFlow({
        host: "ethereal.email",
        port: 993,
        secure: true,
        auth: {
            user: user,
            pass: pass
        }
    })
    await client.connect()
    let message
    // Select and lock a mailbox. Throws if mailbox does not exist
    let lock = await client.getMailboxLock("INBOX")
    try {
        message = await client.fetchOne(client.mailbox.exists, { source: true })
        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.
        // for await (let message of client.fetch("1:*", { envelope: true })) {
        //     console.log(`${message.uid}: ${message.envelope.subject}`)
        // }
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        await client.messageFlagsAdd({ seen: false }, ["\\Seen"])
        lock.release()
    }
    await client.logout()

    //If no message was received (message = false) then return message, to ensure that the task will retry
    //If a message is received return the source in order to parse its content
    if (!message)
        return message
    else
        return message.source

}

module.exports = getLastEmail
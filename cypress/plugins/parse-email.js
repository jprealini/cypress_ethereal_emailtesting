// used to parse emails from the inbox
const simpleParser = require("mailparser").simpleParser

const parseEmail = async (message) => {
    const source = Buffer.from(message)
    const mail = await simpleParser(
        source
    )

    return {
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        attachments: mail.attachments
    }
}

module.exports = parseEmail
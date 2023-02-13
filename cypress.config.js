const { defineConfig } = require("cypress");
const getLastEmail = require('./cypress/plugins/get-last-email');
const sendEmail = require('./cypress/plugins/send-email')
const createTestEmail = require('./cypress/plugins/create-account')
const parseEmail = require('./cypress/plugins/parse-email')

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "https://dashboard.cypress.io",
    setupNodeEvents: async (on, config) => {
      
      on('task', {
        async createTestEmail() {
          const testAccount = await createTestEmail()
          return testAccount
        },
        async getLastEmail({ user, pass }) {
          const get_Email = await getLastEmail(user, pass)
          return get_Email
        },
        async sendEmail({ user, pass, emailObject }) {
          const send_Email = await sendEmail(user, pass, emailObject)
          return send_Email
        },
        async parseEmail({ message }) {
          const parse_Email = await parseEmail(message)
          return parse_Email
        }
      })
    },
  },
});

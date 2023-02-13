/// <reference types="cypress" />
const { recurse } = require('cypress-recurse')

describe('Email confirmation', () => {
  let userEmail
  let userName
  let userPass

  beforeEach(() => {
    recurse(
      () => cy.task("createTestEmail"),
      Cypress._.isObject, // keep retrying until the task returns an object
      {
        log: true,
        timeout: 20000, // retry up to 20 seconds
        delay: 5000, // wait 5 seconds between attempts
        error: "Could not create test email"
      }
    ).then((testAccount) => {
      userEmail = testAccount.user
      userName = userEmail.replace("@ethereal.email", "")
      userPass = testAccount.pass
      cy.log(`Email account created - (for debugging purposes): ${userEmail}`)
      cy.log(`Email account password - (for debugging purposes): ${userPass}`)
    })
  })

  it('Fill in signup form and validate confirmation email is received', () => {
    cy.visit("/signup/email").pause()
    cy.get("#email").type(userEmail)
    cy.get("[type=password]").type(userPass)
    cy.get("button[type=submit]").click()

    cy.log("**redirects to /confirm**")
    cy.location("pathname").should("equal", "/verify")

    // retry fetching the email
    recurse(
      () => cy.task("getLastEmail", { user: userEmail, pass: userPass }), // Cypress commands to retry
      Cypress._.isObject, // keep retrying until the task returns an object
      {
        log: true,
        timeout: 30000, // retry up to 30 seconds
        delay: 5000, // wait 5 seconds between attempts
        error: "Messages Not Found"
      }
    ).then((message) => {
      cy.task("parseEmail", { message })
        .its("html")
        .then((html) => {
          cy.document().then(document => {
            document.body.innerHTML = html;
          });
        })
    })

    cy.log("**Email message content validation**")
    cy.get("h1").should("contain","Activate your account")
    cy.get("a.link-button").should("contain","Verify Email")
  })

  it("Send an email with attachment and validate", () => {
    let emailObject = {
      from: "'Fred Foo 👻' <foo@example.com>", // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
      attachments: [
        {
          filename: "hello.json",
          content: JSON.stringify({
            name: "Hello World!"
          })
        }
      ]
    }

    cy.task("sendEmail", { user: userEmail, pass: userPass, emailObject: emailObject }).then((response) => {
      cy.log("The message id: " + response)
      Cypress.env("messageId", response)
    })

    recurse(
      () => cy.task("getLastEmail", { user: userEmail, pass: userPass }), // Cypress commands to retry
      Cypress._.isObject, // keep retrying until the task returns an object
      {
        log: true,
        timeout: 30000, // retry up to 30 seconds
        delay: 5000, // wait 5 seconds between attempts
        error: "Messages Not Found"
      }
    ).then((message) => {
      console.log("THE SOURCE")
      console.log(message)
      cy.task("parseEmail", { message: message })
        .its("attachments")
        .then((attachments) => {
          expect(attachments[0].filename).to.eq("hello.json")
        })
    })
  })


})
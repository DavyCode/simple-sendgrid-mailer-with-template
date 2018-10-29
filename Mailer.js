const
	sgMail = require('@sendgrid/mail'),
	config = require('./config'),
	Email = require('email-templates'),
	path = require('path'),
	Promise = require("bluebird"),
	previewEmail = require('preview-email');

sgMail.setApiKey(config.sendgridApiKey);

module.exports = function () {
	return {
		sendMail(mailObject) {
			const {
				email,
				username,
				templateName,
				link
			} = mailObject;

			return new Promise((resolve, reject) => {
				this.loadTemplate(templateName, {
						username,
						link
					}).then((result) => {
						const {
							subject,
							html,
							text
						} = result;

						let msg = {
							to: email,
							from: 'Test <info@test.com>',
							subject: subject,
							text: text,
							html: html
						};

						// console.log("IT CAME",msg);
						sgMail.send(msg, (err, res) => {
							if (err) {
								console.log("ERROR using sendgrid", err.message)
								return reject(err)
							} else {
								console.log("IT worked")
								return resolve(res)
							}
						});

					})
					.catch((e) => {
						console.log("Couldnt load email template", e.message)
					})

			});
		},
		loadTemplate(templateName, context) {
			const dir = path.resolve(__dirname, "emailTemplates", templateName);

			const email = new Email({
				views: {
					options: {
						extension: 'ejs' // <---- Set template extension HERE //default extension is pug
					}
				}
			});

			return new Promise((resolve, reject) => {
				email.renderAll(dir, {
						username: context.username,
						link: context.link
					}).then((template) => {
						previewEmail(template).then(console.log).catch(console.error); //Helps preview email in browser
						resolve(template)
					})
					.catch((err) => {
						console.log(err.message)
						reject(err)
					});
			})
		}

	}
}
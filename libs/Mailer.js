'use strict';

var nodemailer = require('nodemailer');
var ServerConfig = require('./../config/ServerConfig');

class Mailer {
	constructor() {
		var serverConfig = new ServerConfig();
		this.transporter = nodemailer.createTransport(serverConfig.getSMTPTransport());
		this.mailFrom = serverConfig.getMailFrom();
	};
	
	sendMail(str_to, str_subject, str_html) {
		var obj_mailOptions = {
			from : this.mailFrom,
			to	: str_to,
			subject	: str_subject,
			html	: str_html
		};
		this.transporter.sendMail(obj_mailOptions, function(err, info) {
			console.log('Mailer : Cannot send mail ')
		});
	};
};

module.exports = Mailer;
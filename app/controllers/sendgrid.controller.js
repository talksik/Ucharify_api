const db = require('../config/db.config.js'),
	errorMaker = require('../helpers/error.maker');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

const {} = db;

exports.testEmail = async (req, res) => {
	try {
		const msg = {
			// personalizations: [
			// 	{
			// 		to: {
			// 			email: 'patelarjun50@gmail.com',
			// 			name: 'Arjun Patel'
			// 		},
			// 		dynamic_template_data: {
			// 			donor_name: 'Arjun Patel',
			// 			charities_list:
			// 				'<div><p>Petes Animals $100</p><p>Goshalala $100</p></div>',
			// 			date: 'April 1st, 2018'
			// 		}
			// 	}
			// ],
			// from: { email: 'no-reply@charify.com', name: 'Charify' },
			// template_id: 'd-569f804f5e7749cba66bac1994607280',

			// subject: 'Your Charity Bundle Payment - Charify',
			// json: true

			to: 'patelarjun50@gmail.com',
			from: 'no-reply@charify.com',
			template_id: 'd-569f804f5e7749cba66bac1994607280',

			substitutionWrappers: ['{{', '}}'],
			dynamic_template_data: {
				donor_name: 'Arjun Patel',
				charities_html:
					'<div><p>Petes Animals $100</p><p>Goshalala $100</p></div>',
				date: 'April 1st, 2018',
				subject: 'Your Charity Bundle Payment - Charify'
			}
		};
		const sentRes = await sgMail.send(msg);

		return res.status(200).json({
			message: 'Email sent'
		});
	} catch (error) {
		throw error;
	}
};

const db = require('../config/db.config.js'),
	errorMaker = require('../helpers/error.maker');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

const {} = db;

exports.paymentReceipt = async ({ organizations, total_amount, receiver }) => {
	try {
		var charitiesHtml = '';

		organizations.forEach(charity => {
			charitiesHtml += `<tr>
			<td align="left" width="75%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${
				charity.name
			}</td>
			<td align="left" width="25%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">$${
				charity.amount
			}</td>
		</tr>`;
		});

		const msg = {
			to: receiver,
			from: { email: 'no-reply@charify.com', name: 'Charify Payments' },
			template_id: 'd-569f804f5e7749cba66bac1994607280',

			substitutionWrappers: ['{{', '}}'],
			dynamic_template_data: {
				donor_name: 'Arjun Patel',
				charities_list: charitiesHtml,
				total_amount,
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

exports.testEmail = async (req, res) => {
	try {
		var charitiesHtml = '';
		const total_amount = 320;

		const msg = {
			to: 'patelarjun50@gmail.com',
			from: { email: 'no-reply@charify.com', name: 'Charify Payments' },
			template_id: 'd-569f804f5e7749cba66bac1994607280',

			substitutionWrappers: ['{{', '}}'],
			dynamic_template_data: {
				donor_name: 'Arjun Patel',
				total_amount,
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

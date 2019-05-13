const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	dateFunctions = require('../helpers/dates');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

const {} = db;

exports.paymentReceipt = async ({
	grant,
	organizations,
	total_amount,
	transaction_fees,
	receiver
}) => {
	try {
		var charitiesHtml = '';

		organizations.forEach(charity => {
			charitiesHtml += `<tr>
			<td align="left" width="75%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${
				charity.name
			} <i>(${charity.ein})</i></td>
			<td align="left" width="25%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">$${charity.finalAmountToOrg.toFixed(
				2
			)}</td>
		</tr>`;
		});

		let currDate = new Date().toDateString();

		const msg = {
			to: receiver.email,
			from: { email: 'no-reply@ucharify.com', name: 'UCharify Payments' },
			template_id: 'd-569f804f5e7749cba66bac1994607280',

			substitutionWrappers: ['{{', '}}'],
			dynamic_template_data: {
				donor_name: receiver.first_name,
				bundle_id: grant.id,
				charities_list: charitiesHtml,
				total_amount,
				transaction_fees: transaction_fees.toFixed(2),
				date: currDate,
				subject: 'Your UCharify Bundle Payment'
			}
		};
		const sentRes = await sgMail.send(msg);
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

exports.passwordResetEmail = async (receiver, code) => {
	return await new Promise(async (resolve, reject) => {
		try {
			const msg = {
				to: receiver,
				from: { email: 'no-reply@ucharify.com', name: 'UCharify Security' },
				template_id: 'd-f26ce08089914f3a983f8932913ed262',

				substitutionWrappers: ['{{', '}}'],
				dynamic_template_data: {
					reset_link: `${
						process.env.WEB_CLIENT
					}/resetpassword/form?code=${code}`,
					subject: 'Reset Your Password'
				}
			};
			const sentRes = await sgMail.send(msg);

			resolve(sentRes);
		} catch (e) {
			reject(e);
		}
	});
};

const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	textCleaner = require('../helpers/text_cleaner');

const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

// configure the keys for accessing AWS
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

const { Organization, sequelize } = db;

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
	const params = {
		ACL: 'public-read',
		Body: buffer,
		Bucket: process.env.S3_BUCKET,
		ContentType: type.mime,
		Key: `${name}.${type.ext}`
	};
	return s3.upload(params).promise();
};

exports.uploadProfilePic = async (req, res, next) => {
	const form = new multiparty.Form();

	form.parse(req, async (error, fields, files) => {
		if (error) next(errorMaker(400, error));
		try {
			const path = files.file[0].path;
			const buffer = fs.readFileSync(path);
			const type = fileType(buffer);
			const timestamp = Date.now().toString();
			const fileName = `bucketFolder/${timestamp}-lg`;
			const data = await uploadFile(buffer, fileName, type);

			await sequelize.query(
				`
					UPDATE organizations 
						SET profile_pic_url = :profilePicUrl
				`,
				{
					type: db.Sequelize.QueryTypes.UPDATE,
					replacements: { profilePicUrl: data.Location }
				}
			);

			return res
				.status(200)
				.json({ message: 'Uploaded the image for charity!' });
		} catch (error) {
			return next(error);
		}
	});
};

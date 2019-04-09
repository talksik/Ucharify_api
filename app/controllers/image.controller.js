const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	textCleaner = require('../helpers/text_cleaner');

const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
var sizeOf = require('image-size');

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
	const charity_id = req.user.id;

	const form = new multiparty.Form();

	form.parse(req, async (error, fields, files) => {
		if (error) next(errorMaker(400, error));
		try {
			const path = files.file[0].path;
			const buffer = fs.readFileSync(path);

			const dimensions = sizeOf(buffer);
			const ratio = dimensions.height / parseFloat(dimensions.width);
			if (
				dimensions.height > 800 ||
				dimensions.width > 800 ||
				dimensions.height < 100 ||
				dimensions.width < 100 ||
				ratio > 1.5 ||
				ratio < 0.5
			)
				return next(errorMaker(400, 'Invalid image dimensions or type'));

			const type = fileType(buffer);
			const timestamp = Date.now().toString();
			const fileName = `charityProfilePic/${timestamp}-lg`;
			const data = await uploadFile(buffer, fileName, type);

			await sequelize.query(
				`
					UPDATE organizations 
						SET profile_pic_url = :profilePicUrl
						WHERE id = :charity_id
				`,
				{
					type: db.Sequelize.QueryTypes.UPDATE,
					replacements: { profilePicUrl: data.Location, charity_id }
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

const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadRoot = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'profile');

fs.mkdirSync(uploadRoot, { recursive: true });

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const mimeExtensions = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif'
};

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, uploadRoot);
	},
	filename: (req, file, callback) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const fileExtension = mimeExtensions[file.mimetype] || path.extname(file.originalname).toLowerCase();
		callback(null, `${uniqueSuffix}${fileExtension}`);
	}
});

module.exports = multer({
	storage,
	limits: { fileSize: 2 * 1024 * 1024 },
	fileFilter: (req, file, callback) => {
		if (!allowedMimeTypes.has(file.mimetype)) {
			callback(new Error('Only image uploads are allowed'));
			return;
		}

		callback(null, true);
	}
});

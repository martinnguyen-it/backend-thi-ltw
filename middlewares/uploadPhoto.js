const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

exports.uploadPhoto = upload.single('photo');

exports.uploadPhotoForUser = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            transformation: [{ width: 400, height: 400, crop: 'fill' }],
        });
        req.body.photo = result.url;
    } catch (error) {
        console.log(
            '🚀 ~ file: uploadImageUser.js:48 ~ exports.resizePhoto=catchAsync ~ error:',
            error,
        );
    }

    next();
});

const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

exports.uploadImages = upload.array('images', 5);

exports.resizeImages = catchAsync(async (req, res, next) => {
    if (!req.files) return next();

    req.body.images = [];

    await Promise.all(
        req.files.map(async (file) => {
            try {
                const result = await cloudinary.uploader.upload(file.path);
                const filename = result.url;
                req.body.images.push(filename);
            } catch (error) {
                console.log(
                    '🚀 ~ file: uploadImageUser.js:48 ~ exports.resizePhoto=catchAsync ~ error:',
                    error,
                );
            }
        }),
    );

    next();
});

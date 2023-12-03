const express = require('express');
const uploadImage = require('../middlewares/uploadImage');
const uploadMultiImages = require('../middlewares/uploadMultiImages');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.isLoggedIn);
router
    .route('/')
    .post(uploadImage.uploadPhoto, uploadImage.getUrl, (req, res) => {
        res.status(200).json({
            status: 'success',
            data: {
                url: req.file.filename,
            },
        });
    });

router
    .route('/multi')
    .post(
        uploadMultiImages.uploadImages,
        uploadMultiImages.resizeImages,
        (req, res) => {
            res.status(200).json({
                status: 'success',
                data: {
                    url: req.body.images,
                },
            });
        },
    );

module.exports = router;

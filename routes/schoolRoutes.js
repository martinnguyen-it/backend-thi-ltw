const express = require('express');
const schoolController = require('../controllers/schoolController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadImage = require('../middlewares/uploadImage');

const router = express.Router();

router
    .route('/')
    .get(schoolController.getAllSchool)
    .post(
        authMiddleware.isLoggedIn,
        authMiddleware.redirectTo('admin', 'editor'),
        uploadImage.uploadPhoto,
        uploadImage.getUrlBody,
        schoolController.createSchool,
    );
router.route('/:id').get(schoolController.getSchool);

router.use(
    authMiddleware.isLoggedIn,
    authMiddleware.redirectTo('admin', 'editor'),
);
router
    .route('/:id')
    .patch(
        uploadImage.uploadPhoto,
        uploadImage.getUrlBody,
        schoolController.updateSchool,
    )
    .delete(
        authMiddleware.isLoggedIn,
        authMiddleware.redirectTo('admin', 'lead-guide'),
        schoolController.deleteSchool,
    );

module.exports = router;

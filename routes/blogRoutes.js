const express = require('express');
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadImage = require('../middlewares/uploadImage');

const router = express.Router();

router
    .route('/')
    .get(blogController.getAllBlog)
    .post(
        authMiddleware.isLoggedIn,
        authMiddleware.redirectTo('admin', 'editor'),
        uploadImage.uploadPhoto,
        uploadImage.getUrlBody,
        blogController.createBlog,
    );

router.route('/:id').get(blogController.getBlog);

router.use(
    authMiddleware.isLoggedIn,
    authMiddleware.redirectTo('admin', 'editor'),
);
router
    .route('/:id')
    .patch(
        uploadImage.uploadPhoto,
        uploadImage.getUrlBody,
        blogController.updateBlog,
    )
    .delete(
        authMiddleware.isLoggedIn,
        authMiddleware.redirectTo('admin', 'lead-guide'),
        blogController.deleteBlog,
    );

module.exports = router;

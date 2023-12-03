const express = require('express');
const supplyController = require('../controllers/supplyController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadImage = require('../middlewares/uploadImage');

const router = express.Router();

router.use(authMiddleware.isLoggedIn);
router
    .route('/')
    .get(supplyController.getAllSupply)
    .post(
        uploadImage.uploadPhoto,
        uploadImage.getUrlBody,
        supplyController.createSupply,
    );
router.route('/:id').get(supplyController.getSupply);

router
    .route('/:id')
    .patch(
        uploadImage.uploadPhoto,
        uploadImage.getUrlBody,
        supplyController.updateSupply,
    )
    .delete(
        authMiddleware.isLoggedIn,
        authMiddleware.redirectTo('admin', 'lead-guide'),
        supplyController.deleteSupply,
    );

module.exports = router;

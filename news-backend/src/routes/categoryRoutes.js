const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, authorize('ADMIN'), createCategory);

router.route('/:id')
    .delete(protect, authorize('ADMIN'), deleteCategory);

module.exports = router;

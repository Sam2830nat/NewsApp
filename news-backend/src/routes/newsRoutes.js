const express = require('express');
const router = express.Router();
const {
    getNews,
    getNewsById,
    getNewsFeed,
    createNews,
    updateNews,
    deleteNews,
} = require('../controllers/newsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getNews)
    .post(protect, authorize('ADMIN'), createNews);

router.get('/feed', protect, getNewsFeed);

router.route('/:idOrSlug')
    .get(getNewsById)
    .put(protect, authorize('ADMIN'), updateNews)
    .delete(protect, authorize('ADMIN'), deleteNews);

module.exports = router;

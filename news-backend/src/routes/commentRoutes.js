const express = require('express');
const router = express.Router();
const {
    addComment,
    getComments,
    updateComment,
    deleteComment
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addComment)
    .get(protect, authorize('ADMIN'), getComments);

router.route('/:id')
    .put(protect, updateComment)
    .delete(protect, deleteComment);

module.exports = router;

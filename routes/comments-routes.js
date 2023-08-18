const express = require('express');

const commentsController = require('../controllers/comments-controllers');
const { loginRequired } = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/', commentsController.getAllComments);

router.get('/:cid', commentsController.getCommentById);

// Get comments by user id
router.get('/user/:uid', commentsController.getCommentsByUserId);

router.post('/', loginRequired, commentsController.postComment);

router.put('/:cid', commentsController.updateCommentById);

router.delete('/:cid', commentsController.deleteCommentById);

module.exports = router;

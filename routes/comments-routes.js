const express = require('express');
const { loginRequired } = require('../middleware/auth-middleware');

const commentsController = require('../controllers/comments-controllers');

const router = express.Router();

router.get('/', commentsController.getAllComments);

router.get('/:cid', commentsController.getCommentById);

router.post('/', loginRequired, commentsController.postComment);

router.put('/:cid', loginRequired, commentsController.updateCommentById);

router.delete('/:cid', loginRequired, commentsController.deleteCommentById);

module.exports = router;

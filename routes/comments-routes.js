const express = require('express');

const commentsController = require('../controllers/comments-controllers');

const router = express.Router();

router.get('/', commentsController.getAllComments);

router.get('/:cid', commentsController.getCommentById);

router.post('/', commentsController.postComment);

router.put('/:cid', commentsController.updateCommentById);

router.delete('/:cid', commentsController.deleteCommentById);

module.exports = router;

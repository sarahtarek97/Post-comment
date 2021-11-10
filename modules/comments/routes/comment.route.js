const router = require('express').Router();
const validateRequest = require('../../../common/validateRequest');
const {addCommentSchema} = require('../joi/comment.joi');
const isAuthrized = require('../../../common/isAuthrized');
const {allComments,addcomment,editComment,deleteComment,like} = require('../controller/comment.controller');
const {ADD_COMMENT,ALL_COMMENTS,EDIT_COMMENT,DELETE_COMMENT,LIKE_COMMENT} = require('../endpoints');



//APIs
router.get('/allComments',isAuthrized(ALL_COMMENTS),allComments);
router.post('/addcomment',isAuthrized(ADD_COMMENT),addcomment);
router.patch('/editComment',isAuthrized(EDIT_COMMENT),editComment);
router.delete('/deleteComment',isAuthrized(DELETE_COMMENT),deleteComment)
router.put('/likeComment',isAuthrized(LIKE_COMMENT),like);

module.exports = router;
const { UPDATE_PROFILE } = require("../../../modules/users/endpoints");
const {ADD_POST,GET_ALL_POSTS,EDIT_POST,DELETE_POST,LIKE_POST} = require('../../../modules/posts/endpoints');
const {ADD_COMMENT,ALL_COMMENTS,EDIT_COMMENT,DELETE_COMMENT,LIKE_COMMENT} = require('../../../modules/comments/endpoints');

module.exports = [UPDATE_PROFILE,ADD_POST,GET_ALL_POSTS,EDIT_POST,DELETE_POST,LIKE_POST,ADD_COMMENT,ALL_COMMENTS,EDIT_COMMENT,DELETE_COMMENT,LIKE_COMMENT];
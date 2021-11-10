const { GET_ALL_USERS } = require("../../../modules/users/endpoints");
const {GET_ALL_POSTS,ADD_POST,EDIT_POST,DELETE_POST,LIKE_POST} = require('../../../modules/posts/endpoints');
const {ADD_COMMENT, ALL_COMMENTS,EDIT_COMMENT,DELETE_COMMENT,LIKE_COMMENT} = require('../../../modules/comments/endpoints');

module.exports = [GET_ALL_USERS,GET_ALL_POSTS,ADD_POST,EDIT_POST,DELETE_POST,LIKE_POST,ADD_COMMENT,ALL_COMMENTS,EDIT_COMMENT,DELETE_COMMENT,LIKE_COMMENT]
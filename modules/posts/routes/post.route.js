const router = require('express').Router();
const validateRequest = require('../../../common/validateRequest');
const {addPostSchema} = require('../joi/post.joi');
const isAuthrized = require('../../../common/isAuthrized');
const {getAllPosts,addPost,editPost,deletePost,like,} = require('../controller/post.controller');
const {GET_ALL_POSTS,ADD_POST,EDIT_POST,DELETE_POST,LIKE_POST} = require('../endpoints');

const multer = require('multer');
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./upload/')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString() + file.originalname)
    }
})
const upload = multer({storage});

//APIs
router.get('/allPosts',isAuthrized(GET_ALL_POSTS),getAllPosts);
router.post('/addPost',upload.single('postImg'),isAuthrized(ADD_POST),addPost);
router.patch('/editPost',isAuthrized(EDIT_POST),editPost);
router.delete('/deletePost',isAuthrized(DELETE_POST),deletePost)
router.put('/like',isAuthrized(LIKE_POST),like);

module.exports = router;
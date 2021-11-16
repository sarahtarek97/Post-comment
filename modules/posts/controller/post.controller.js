const { StatusCodes } = require("http-status-codes");
const Post = require("../model/post.model"); 
const Comment = require('../../comments/model/comment.model');
const client = require('../../../common/redis/redis.js')

const getAllPosts= async(req,res)=>{
    let {page,size} = req.query;
    if(!page){
        page = 1;
    }
    if(!size){
        size = 10;
    }
    const limit = parseInt(size);
    const skip = (page-1)*size;

    //const posts = await Post.find({}).limit(limit).skip(skip);
    //const all = await Post.count();
    //const totalPages = Math.ceil(all/limit);
    //res.json({page:page,size:size,totalPages:totalPages,message:'posts',posts:posts});
    resultArr = [];
    const cursor = Post.find({}).populate('createdBy').cursor();
    for(let doc = await cursor.next(); doc != null; doc = await cursor.next() ){
        const comments = await Comment.find({postId:doc._id}).populate('createdBy');
        const obj = {...doc._doc,comments};
        resultArr.push(obj);
    }
    client.setex('posts',59,JSON.stringify(resultArr));
    res.json({page:page,size:size,message:'All posts with comments',Data:resultArr});
    
}

const addPost = async (req,res)=>{
    let {name,description,createdBy,postImg} = req.body;
    try{
        console.log(req.file);
        let newPost = new Post({name,description,createdBy,postImg:process.env.IMAGE_URL});
        const post = await newPost.save();
        res.json({message:'post added success',post});
    
    } catch (error) {
        res.json({message:'error while adding post', error})
        }
}

const editPost = async(req,res)=>{
    let {postId,description,createdBy} = req.body;
    try {
        if(req.user._id == createdBy){
            const post = await Post.updateOne({ _id:postId}, { description });
            res.json({ message: "updated success", post });
        }else{
            res.json({ message: "you're not the post owner so you can't edit" });
        }
    } catch (error) {
        res.json({message:'error while editing the post', error})
    }
}

const deletePost = async(req,res)=>{
    let {postId,createdBy} = req.body;
    try {
        if(req.user._id == createdBy){
            const post = await Post.deleteOne({_id:postId});
            res.json({ message: "post deleted", post });
        }else{
            res.json({ message: "you're not the post owner so you can't delete" });
        }
    } catch (error) {
        res.json({message:'error while deleting the post', error})
    }
}

const like = async(req,res)=>{
    let {postId} = req.body;
    let post = await Post.findOne({_id:postId});
    let arr = post.likes;
    try {
        if(!arr.includes(req.user._id)){
       await Post.findByIdAndUpdate(postId,{
            $push:{likes:req.user._id}
        }, {new:true}).exec((err,result)=>{
            if(err){
                res.json({message:'error like', err})
            }else{
               var numberOfLikes = arr.length+1;
                res.json({result, Likes: numberOfLikes});
            }
        })
    }else{
        await Post.findByIdAndUpdate(postId,{
            $pull:{likes:req.user._id}
        }, {new:true}).exec((err,result)=>{
            if(err){
                res.json({message:'error like', err})
            }else{
                var numberOfLikes = arr.length-1;
                res.json({result, Likes: numberOfLikes});            }
        })    }
    } catch (error) {
        res.json({message:'error like the post', error})
    }
}

module.exports = {
    getAllPosts,
    addPost,
    editPost,
    deletePost,
    like,
}
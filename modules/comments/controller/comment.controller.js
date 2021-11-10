const { StatusCodes } = require("http-status-codes");
const Comment = require("../model/comment.model"); 
const Post = require('../../posts/model/post.model');

const allComments = async(req,res)=>{
    let {page,size} = req.query;
    if(!page){
        page = 1;
    }
    if(!size){
        size = 10;
    }
    const limit = parseInt(size);
    const skip = (page-1)*size;
    const comment = await Comment.find({}).limit(limit).skip(skip);
    const all = await Comment.count();
    const totalPages = Math.ceil(all/limit);
    res.json({message:'all comments',totalPages:totalPages,comment});
}


const addcomment = async (req,res)=>{
    let {content , createdBy , postId } = req.body;
    try{
        let newComment = new Comment({content , createdBy , postId});
        const result = await newComment.save();
        res.json({message:'comment added success',result});
    } catch (error) {
        res.json({message:'error while adding comment', error})
        }
}

const editComment = async(req,res)=>{
    let {commentId,content,createdBy} = req.body;
    try {
        if(req.user._id == createdBy){
            const comment = await Comment.updateOne({ _id:commentId}, { content });
            res.json({ message: "updated success", comment });
        }else{
            res.json({ message: "you're not the comment owner so you can't edit" });
        }
    } catch (error) {
        res.json({message:'error while editing the comment', error})
    }
}

const deleteComment = async(req,res)=>{
    let {commentId,createdBy,postId} = req.body;
    const postOwner = await Post.findOne({postId}).populate('createdBy');
    try {
        if(req.user._id == createdBy || postOwner){
            const comment = await Comment.deleteOne({_id:commentId});
            res.json({ message: "comment deleted", comment });
        }else{
            res.json({ message: "you're not the comment owner so you can't delete" });
        }
    } catch (error) {
        res.json({message:'error while deleting the comment', error})
    }
}

const like = async(req,res)=>{
    let {commentId} = req.body;
    let comment = await Comment.findOne({_id:commentId});
    let arr = comment.likes;

    try {
        if(!arr.includes(req.user._id)){
       await Comment.findByIdAndUpdate(commentId,{
            $push:{likes:req.user._id}
        }, {new:true}).exec((err,result)=>{
            if(err){
                res.json({message:'error like', err})
            }else{
                var numberOfLikes = arr.length+1;
                res.json({result, Likes: numberOfLikes});            }
        })
    }else{
        await Comment.findByIdAndUpdate(commentId,{
            $pull:{likes:req.user._id}
        }, {new:true}).exec((err,result)=>{
            if(err){
                res.json({message:'error like', err})
            }else{
                var numberOfLikes = arr.length-1;
                res.json({result, Likes: numberOfLikes});            }
        })    }
    } catch (error) {
        res.json({message:'error like the comment', error})
    }
}
module.exports = {
    allComments,
    addcomment,
    editComment,
    deleteComment,
    like
}
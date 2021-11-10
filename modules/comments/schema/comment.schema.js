const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
    postId: {type: mongoose.Schema.Types.ObjectId, ref:'post'},
    likes:[{type: mongoose.Schema.Types.ObjectId, ref:'user'}]
    },{
    timestamps: true,
    }
);


module.exports = commentSchema;
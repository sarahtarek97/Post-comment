

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    name:{type: String},
    description:{type: String},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
    //comments: [{type: Mongoose.Schema.Types.ObjectId, ref: 'comment'}],
    postImg: {type: String},
    likes:[{type: mongoose.Schema.Types.ObjectId, ref:'user'}]
    },{
    timestamps: true,
    }
);


module.exports = postSchema;
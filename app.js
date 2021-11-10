const express = require('express');
const app = express();
const connection = require('./configration/config');
require('dotenv').config()
const port = process.env.PORT;
console.log(`process:`,process.env.PORT);
const userRouter = require('./modules/users/routes/user.route');
const productRouter = require('./modules/posts/routes/post.route');
const commentRouter = require('./modules/comments/routes/comment.route');

//mongodb connection
connection();

//middleware
app.use(express.json());
app.use('/upload',express.static('upload'));

app.get('/',(req,res)=>{
    res.send('express');
})

//import the modules
app.use(userRouter);
app.use(productRouter);
app.use(commentRouter);


//run the server
app.listen(port,()=>{
    console.log(`the server is fine${port}`)
})
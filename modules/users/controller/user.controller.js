const { StatusCodes } = require("http-status-codes");
const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const {createInvoice} = require('../createPDF/createPdf');
const nodemailer = require('nodemailer');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(`${process.env.CLIENT_ID}`)

const {nanoid} = require('nanoid');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

const getAllUsers = async (req,res)=>{
    const user = await User.find({});
    res.json({message:'users',user:user});
}

const signup = async (req,res)=>{
    let {userName,email,password,role,profileImg,age} = req.body;
    try{
    console.log(req.file);
    const user = await User.findOne({email});
        if(user){
            res.status(StatusCodes.BAD_REQUEST).json({
                message:'email already exsist'
            })
        }else{
            let newUser = new User({userName,email,password,age,role,profileImg:`http://localhost:3000/${req.file.path}`});
            const user = await newUser.save();
            res.json({message:'sign up success',user});
        }
    } catch (error) {
        res.json({message:'sign up error', error})
        }
}

const verifyUser = async (req, res) => {
    const decoded = jwt.verify(req.params.token, "shhh");
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid email" });
    } else {
      const updated = await User.updateOne(
        { email: decoded.email },
        { verified: true }
      );
      res.json({ message: "verfied success" });
    }
  };

const signin = async(req,res)=>{
        let {email,password} = req.body;
      
          const user = await User.findOne({email});
          if(!user){
              res.status(StatusCodes.BAD_REQUEST).json({message:'email not found signUp at first'})
          }else{
              const match = await bcrypt.compare(password,user.password);
            if(match){
                let token = jwt.sign({_id:user._id,role:user.role},'shhh');
                res.status(StatusCodes.OK).json({
                    token,
                    user
                });
            }else{
              res.status(StatusCodes.BAD_REQUEST).json({message:'wrong password'})
            }
          }   
}

const googleLogin = async(req,res)=>{
    let {tokeId,googleId} = req.body;

    client.verifyIdToken({idToken:tokeId,audience:process.env.CLIENT_ID})
    .then(async(result)=>{
        console.log(result);
        const {payload} = result;
        if(payload.email_verified){
            const user = await User.findOne({googleId})
            if(user){
                let token = jwt.sign({_id:user._id,role:user.role},'shhh');
                res.status(StatusCodes.OK).json({
                    token,
                    user
                });
            }else{
                const newUser = new User({userName:payload.name,email:payload.email,role:'user',googleId,profileImg:payload.picture,verified:'true',password:nanoid()});
                const savedUser = await newUser.save();
                let token = jwt.sign({_id:user._id,role:user.role},'shhh');
                res.status(StatusCodes.OK).json({
                    token,
                    savedUser
                });
            }
        }else{
            res.json({message:'email not verified'})
        }
    }).catch((err)=>{
        console.log(err);
    })


}

const updateProfilePic = async(req,res)=>{
    let {profileImg,path} = req.body;
    try {
        const user = await User.updateOne({profileImg:path},{profileImg:`http://localhost:3000/${req.file.path}`});
        res.json({message:"profile picture updated success",user});
    } catch (error) {
        res.json({message:"profile update erorr",error});
    }
}

const createPdf = async (req,res)=>{
    try {
    
        let {email} = req.body;
        const user = await User.findOne({email});
        //console.log(user.profileImg.split('3000')[1]);
        createInvoice(user, "invoice.pdf");
        let info = await transporter.sendMail({
            from: '"Company 👻" <foo@example.com>', // sender address
            to: `${email}`, // list of receivers
            subject: "Your Profile ✔", // Subject line
            text: "find your profile data attached", // plain text body
            html: "<b>Your profile is here!</b>", // html body

            attachments: [
                {   // utf-8 string as an attachment
                    filename: `${user.userName}-profile.pdf`,
                    path: 'invoice.pdf',
                    contentType: 'application/pdf'
                },
            ]
          });
        res.json({message:'fineeee'})
    } catch (error) {
        res.json({message:error})
    }
}

module.exports = {
    getAllUsers,
    signup,
    verifyUser,
    signin,
    updateProfilePic,
    createPdf,
    googleLogin
}
const User = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const fs = require("fs");

const securePassword = async(password)=>{
    try {
        const passwordHash = await bcryptjs.hash(password,10);
        return passwordHash;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const createToken = async(id)=>{
    try {
        const token = await jwt.sign({_id:id},config.secret_jwt);
        return token;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const sendResetPasswordMail = async(name,email,token)=>{
    try {

       const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser,
            }
        });

        const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'For reset password',
            html:'<p>Hi '+name+', Please click this this given link to reset your password <a href="http://localhost:1000/api/reset_password?token='+token+'"> Click me </a></p>'
        }
        
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }else{
                console.log("Mail has been sent:- ",info.response);
            }
        });

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

const register_user = async(req,res)=>{
    try{

        const sPassword = await securePassword(req.body.password);
        const tokenData = await createToken(user_data._id);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: sPassword,
            image: req.file.filename,
            mobile:req.body.mobile,
            type:req.body.type,
            token:tokenData
        });

        //if user already available
        const userData = await User.findOne({email:req.body.email});
        if(userData){
            res.status(200).send({status:false,msg:"This email is already exists"});
        }else{
            const user_data = await user.save();
            res.status(200).send({success:true,data:user_data});
        }

    }catch(error){
        res.status(400).send(error.message);
    }
}

const login_user = async(req,res)=>{
    try {

        const email = req.body.email;
        const password = req.body.password;

        const user_data = await User.findOne({email:email});
        if(user_data){

            const passwordMatch = await bcryptjs.compare(password,user_data.password);
            if(passwordMatch){

                const tokenData = await createToken(user_data._id);

                const userResult = {
                    _id:user_data._id,
                    name:user_data.name,
                    email:user_data.email,
                    password:user_data.password,
                    image:user_data.image,
                    mobile:user_data.mobile,
                    type:user_data.type,
                    token:tokenData
                }

                const response = {
                    success:true,
                    msg:"User Details",
                    data:userResult
                }

                res.status(200).send(response);

            }else{
                res.status(200).send({success:false,msg:"Login details are incorrect"});
            }
        }else{
            res.status(200).send({success:false,msg:"Login details are incorrect"});
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const update_password = async(req,res)=>{
    try {

        const userId = req.body._id;
        const password = req.body.password;

        const data = await User.findOne({_id:userId});
        if(data){

            const newPassword = await securePassword(password);

            const userData = await User.findByIdAndUpdate({_id:userId},{$set:{
                password:newPassword
            }});

            res.status(200).send({success:true,msg:"Your password has been updated successfully."});

        }else{
            res.status(200).send({success:false,msg:"User id not found!"});
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const forget_password = async(req,res)=>{
    try {
        const email = req.body.email;
        const userData = await User.findOne({email:req.body.email});
        if(userData){
            const randomString = randomstring.generate();
            const data = await User.updateOne({email:email},{$set:{
                token:randomString
            }}); 
            sendResetPasswordMail(userData.name,userData.email,randomString);
            res.status(200).send({success:true,msg:"Please check your email inbox and reset your password."});
        }else{
            res.status(200).send({success:true,msg:"This email does not exists!"});
        }
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

const reset_password = async(req,res)=>{
    try {

        const token = req.query.token;
        const tokenData = await User.findOne({token:token});

        if(tokenData){
            const password = req.body.password;
            const newPassword = await securePassword(password);

            const userData = await User.findByIdAndUpdate({_id:tokenData._id},{$set:{
                password:newPassword,
                token:''
            }},{new:true});

            res.status(200).send({success:true,msg:"Your password has been reset successfully.",data:userData})

        }else{
            res.status(200).send({success:true,msg:"This link has been expired!"});
        }

        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

//renew token general method from refresh token
const renew_token = async(id)=>{
    try {

        const secret_jwt = config.secret_jwt;
        const newSecretJwt = randomstring.generate();

        fs.readFile('config/config.js','utf-8',function(err,data){
            if(err) throw err
            var newValue = data.replace(new RegExp(secret_jwt,"g"),newSecretJwt);
            fs.writeFile('config/config.js',newValue,'utf-8',function(err,data){
                if(err) throw err
                console.log('Done!');
            });
        });

        const token = await jwt.sign({_id:id},newSecretJwt);
        return token;
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

const refresh_token = async(req,res)=>{
    try {

        const user_id = req.body.user_id;
        const userData = await User.findById({_id:user_id});
        if(userData){
            const tokenData = await renew_token(user_id);
            const response = {
                user_id:user_id,
                token:tokenData
            }
            res.status(200).send({success:true,msg:"Refresh token details",data:response});

        }else{
            res.status(200).send({success:false,msg:"User not available!"});
        }
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

module.exports = {
    register_user,
    login_user,
    update_password,
    forget_password,
    reset_password,
    refresh_token
}
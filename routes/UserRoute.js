const express = require("express");
const user_route = express();

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

//for access of public folder where we will add all images/files.
user_route.use(express.static('public'));

//fileupload
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/UserImages'),function(error,success){
            if(error) throw error
        });
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null, name, function(error1, success1){
            if(error1) throw error1
        });
    }
});

const upload = multer({storage:storage});

//call controller methods here
const userController = require("../controllers/UserController");
const auth = require("../middlewares/Auth");

user_route.post('/register',upload.single('image'),userController.register_user);
user_route.post('/login',userController.login_user);
user_route.post('/update_password',auth,userController.update_password);
user_route.post('/forget_password',userController.forget_password);
user_route.post('/reset_password',userController.reset_password);
user_route.post('/refresh_token',auth,userController.refresh_token);

module.exports = user_route;
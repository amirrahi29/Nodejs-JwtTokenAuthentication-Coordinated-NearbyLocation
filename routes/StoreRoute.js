const express = require("express");
const store_route = express();

const bodyParser = require("body-parser");
store_route.use(bodyParser.json());
store_route.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

//for access of public folder where we will add all images/files.
store_route.use(express.static('public'));

//fileupload
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/StoreImages'),function(error,success){
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
const storeController = require("../controllers/StoreController");
const auth = require("../middlewares/Auth");

store_route.post('/create_store',auth,upload.single('logo'),storeController.create_store);
store_route.post('/find_nearest_store',auth,storeController.find_nearest_store);

module.exports = store_route;


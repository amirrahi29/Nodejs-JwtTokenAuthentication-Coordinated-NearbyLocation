const express = require('express');
const product_route = express();

const bodyParser = require("body-parser");
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

product_route.use(express.static('public'));

//fileupload
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/ProductImages'),function(error,success){
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

const auth = require("../middlewares/Auth");
const productController = require("../controllers/ProductController");

product_route.post('/add_product',upload.array('images'),auth,productController.add_product);
product_route.post('/get_products',auth,productController.get_products);
product_route.post('/search_product',auth,productController.search_product);

module.exports = product_route;
const Product = require("../models/ProductModel");
const categoryController = require("../controllers/CategoryController");
const storeController = require("../controllers/StoreController");

const add_product = async(req,res)=>{
    try {
        var arrImages = [];
        for(let i = 0; i<req.files.length; i++){
            arrImages[i] = req.files[i].filename;
        }

        var product = new Product({
            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id,
            name:req.body.name,
            price:req.body.price,
            discount:req.body.discount,
            category_id:req.body.category_id,
            sub_category_id:req.body.sub_category_id,
            images:arrImages
        });

        const productData = await product.save();
        res.status(200).send({success:true,msg:"Product details",data:productData});
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

const get_products = async(req,res)=>{
    try {
        var sendData = [];
        var catData = await categoryController.getCategories();
        if(catData.length>0){
            
            for(let i = 0; i<catData.length; i++){
                var productData = [];
                var cat_id = catData[i]['_id'].toString();
                var catPro = await Product.find({category_id:cat_id});
                if(catPro.length>0){
                    for(let j = 0; j<catPro.length; j++){
                        var store_data = await storeController.getStore(catPro[j]['store_id']);
                        productData.push({
                            "product_name":catPro[j]['name'],
                            "product_price":catPro[j]['price'],
                            "product_discount":catPro[j]['discount'],
                            "images":catPro[j]['images'],
                            "store_address":store_data['address'],
                        });
                    }
                }
                sendData.push({
                    "category":catData[i]['category'],
                    "product":productData
                });
            }
            res.status(200).send({success:true,msg:"Product Details",data:sendData});

        }else{
            res.status(200).send({success:false,msg:"Product details",data:sendData});
        }
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

const search_product = async(req,res)=>{
    try {
        var search = req.body.search;
        const searchData = await Product.find({"name": {$regex:".*"+search+".*",$options:'i'}});
        if(searchData.length>0){
            res.status(200).send({success:true,msg:"Product details",data:searchData});
        }else{
            res.status(200).send({success:true,msg:"No product found!"});
        }
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

module.exports = {
    add_product,
    get_products,
    search_product
}
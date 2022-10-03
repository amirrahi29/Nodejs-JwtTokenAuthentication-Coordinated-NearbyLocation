const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");
const SubCategory = require("../models/SubCategoryModel");

const data_count = async(req,res)=>{
    try {
        const count_data = [];
        const product_data = await Product.find().count();
        const vendor_data = await User.find({type:1}).count();
        const category_data = await Category.find().count();
        const Sub_category_data = await SubCategory.find().count();

        count_data.push({
            products:product_data,
            vendors:vendor_data,
            categories:category_data,
            sub_categories:Sub_category_data
        });

        res.status(200).send({success:true,msg:"Counting data",data:count_data});
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

module.exports = {
    data_count
}
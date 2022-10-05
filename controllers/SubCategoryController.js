const SubCategory = require("../models/SubCategoryModel");

const add_sub_category = async(req,res)=>{

    try {

        const checkSub = await SubCategory.find({category_id:req.body.category_id});
        if(checkSub){

            let checking = false;
            for(let i = 0; i<checkSub.length; i++){
                if(checkSub[i]['sub_category'].toLowerCase() === req.body.sub_category.toLowerCase()){
                    checking = true;
                    break;
                }
            }
            if(checking === false){
                const subCategory = new SubCategory({
                    category_id:req.body.category_id,
                    sub_category:req.body.sub_category
                });
                const subCatData = await subCategory.save();
                res.status(200).send({success:true,msg:"Sub Category Details",data:subCatData});
            }
            else{
                res.status(200).send({success:true,msg:"This subcategory ("+req.body.sub_category+") is already exists!"});
            }
        }else{
            const subCategory = new SubCategory({
                category_id:req.body.category_id,
                sub_category:req.body.sub_category
            });
        }

        const subCatData = await subCategory.save();
        res.status(200).send({success:true,msg:"Sub Category Details",data:subCatData});
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

const getSubCategories = async()=>{
    try {
        return SubCategory.find();
    } catch (error) {
        res.status(400).send({success:false,mesg:error.message});
    }
}

module.exports = {
    add_sub_category,
    getSubCategories
}
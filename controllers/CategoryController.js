const Category = require("../models/CategoryModel");

const add_category = async(req,res) =>{

    try {

        const categoryData = await Category.find();
        if(categoryData.length>0){

            let checking = false;
            for(let i = 0; i<categoryData.length; i++){
                if(categoryData[i]['category'].toLowerCase() === req.body.category.toLowerCase()){
                    checking = true;
                    break;
                }
            }

            if(checking == false){
                const category = new Category({
                    category:req.body.category
                });
                
                const cateData = await category.save();
                res.status(200).send({success:true,mesg:"Category data",data:cateData});
            }else{
                res.status(200).send({success:true,mesg:"This category ("+req.body.category+") is already exists!"});
            }

        }else{
            const category = new Category({
                category:req.body.category
            });
            
            const cateData = await category.save();
            res.status(200).send({success:true,mesg:"Category data",data:cateData});
        }
    } catch (error) {
        res.status(400).send({success:false,mesg:error.message});
    }
}

const getCategories = async()=>{
    try {
        return await Category.find();
    } catch (error) {
        res.status(400).send({success:false,mesg:error.message});
    }
}

module.exports = {
    add_category,
    getCategories
}
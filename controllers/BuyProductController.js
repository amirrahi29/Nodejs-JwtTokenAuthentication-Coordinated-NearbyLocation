const BuyProduct = require("../models/BuyProductModel");

const buy_products = async(req,res)=>{
    
    
    const buyProduct = new BuyProduct({
        product_id:req.body.product_id,
        transaction_id:req.body.transaction_id,
        vendor_id:req.body.vendor_id,
        store_id:req.body.store_id,
        customer_id:req.body.customer_id,
    });

    const buyProductData = await buyProduct.save();
    res.status(200).send({success:true,msg:"Buy product details",data:buyProductData});
}

module.exports = {
    buy_products
}
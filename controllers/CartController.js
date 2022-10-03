const Cart = require("../models/CartModel");

const add_cart = async(req,res)=>{
    try {
        const cartObj = new Cart({
            product_id:req.body.product_id,
            price:req.body.price,
            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id,
        });

        const cartData = await cartObj.save();
        res.status(200).send({success:true,msg:"Cart products details",data:cartData});
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

module.exports = {
    add_cart
}
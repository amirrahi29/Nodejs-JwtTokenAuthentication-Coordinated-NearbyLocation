const Address = require("../models/AddressModel");

const add_addresses = async(req,res)=>{
    try {

        const data = await Address.findOne({user_id:req.body.user_id});
        if(data){

            var addAddress = [];
            for(let i = 0; i<data.address.length; i++){
                addAddress.push(data.address[i]);
            }
            addAddress.push(req.body.address);

            const updatedData = await Address.findOneAndUpdate(
                {user_id:req.body.user_id},
                {$set:{address:addAddress}},
                {returnDocument:"after"}
            );

            res.status(200).send({success:true,msg:"Address Details",data:updatedData});

        }else{
            const address = new Address({
                user_id:req.body.user_id,
                address:req.body.address,
            });
    
            const addressData = await address.save();
            res.status(200).send({success:true,msg:"Address Details",data:addressData});
        }
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

module.exports = {
    add_addresses
}
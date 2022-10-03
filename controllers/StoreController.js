const Store = require("../models/StoreModel");
const User = require("../models/UserModel");


const create_store = async(req,res)=>{

    try {

        const userData1 = await User.findOne({_id:req.body.vendor_id});
        if(userData1){

            if(!req.body.latitude || !req.body.longitude){
                res.status(200).send({success:false,msg:"Lat and lng not found!"});
            }else{
                const vendorData = await Store.findOne({vendor_id:req.body.vendor_id});
                if(vendorData){
                    res.status(200).send({success:false,msg:"This vendor has already added a store."});
                }else{
                    const store = Store({
                        vendor_id: req.body.vendor_id,
                        logo:req.file.filename,
                        business_email:req.body.business_email,
                        address:req.body.address,
                        pin:req.body.pin,
                        location:{
                            type:"Point",
                            coordinates:[
                                parseFloat(req.body.latitude),
                                parseFloat(req.body.longitude)
                            ]
                        }
                    });

                    const storeData = await store.save();
                    res.status(200).send({success:true,msg:"Store added successfully.",data:storeData});
                }
            }

        }else{
            res.status(200).send({success:false,msg:"Vendor id does not exist!"});
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getStore = async(id)=>{
    try {

       return  Store.findOne({_id:id});
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const find_nearest_store = async(req,res)=>{
    try {

        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        const maxDistance = req.body.maxDistance;
        
        const storeData = await Store.aggregate([
            {
                $geoNear:{
                    near:{type:"Point",coordinates:[parseFloat(latitude),parseFloat(longitude)]},
                    key:"location",
                    maxDistance:parseFloat(maxDistance)*1609,
                    distanceField:"dist.calculated",
                    spherical:true
                } 
            }
        ]);

        res.status(200).send({success:true,msg:"Store Details",data:storeData});

    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    create_store,
    getStore,
    find_nearest_store
}
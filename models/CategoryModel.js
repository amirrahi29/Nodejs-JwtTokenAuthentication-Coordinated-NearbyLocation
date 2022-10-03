const { default: mongoose } = require("mongoose");
const mognoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category:{
        type:String,
        required:true
    }
});


module.exports = mognoose.model("Category",categorySchema);
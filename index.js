const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://rojkharido:rojkharido123@cluster0.inawa.mongodb.net/nine_mm?retryWrites=true&w=majority");

//user routes
const user_routes = require("./routes/UserRoute");
app.use('/api',user_routes);

//store routes
const store_routes = require("./routes/StoreRoute");
app.use('/api',store_routes);

//category routes
const category_routes = require("./routes/CategoryRoute");
app.use('/api',category_routes);

//sub category routes
const sub_category_routes = require("./routes/SubCategoryRoute");
app.use('/api',sub_category_routes);

//product routes
const product_routes = require("./routes/ProductRoute");
app.use('/api',product_routes);

//common routes
const common_routes = require("./routes/CommonRoute");
app.use('/api',common_routes);

//cart routes
const cart_routes = require("./routes/CartRoute");
app.use('/api',cart_routes);

//address routes
const address_routes = require("./routes/AddressRoute");
app.use('/api',address_routes);

//buy routes
const buy_routes = require("./routes/BuyProductRoute");
app.use('/api',buy_routes);

app.listen(process.env.PORT || 1000,function(){
    console.log("Server is ready");
});



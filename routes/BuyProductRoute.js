const express = require("express");
const buy_routes = express();

const bodyParser = require("body-parser");
buy_routes.use(bodyParser.json());
buy_routes.use(bodyParser.urlencoded({extended:true}));

const auth = require("../middlewares/Auth");
const buyProductController = require("../controllers/BuyProductController");

buy_routes.post('/buy_products',auth,buyProductController.buy_products);

module.exports = buy_routes;
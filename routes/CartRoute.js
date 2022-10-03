const express = require('express');
const cart_route = express();

const bodyParser = require('body-parser');
cart_route.use(bodyParser.json());
cart_route.use(bodyParser.urlencoded({extended:true}));

const auth = require("../middlewares/Auth");
const cartController = require("../controllers/CartController");

cart_route.post('/add_cart',auth,cartController.add_cart);

module.exports = cart_route;
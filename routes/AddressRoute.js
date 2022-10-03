const express = require("express");
const address_route = express();

const bodyParser = require("body-parser");
address_route.use(bodyParser.json());
address_route.use(bodyParser.urlencoded({extended:true}));

const auth = require("../middlewares/Auth");
const addressController = require("../controllers/AddressController");

address_route.post('/add_addresses',auth,addressController.add_addresses);

module.exports = address_route;
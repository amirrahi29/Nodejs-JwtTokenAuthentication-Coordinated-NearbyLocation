const express = require("express");
const common_route = express();

const bodyParser = require("body-parser");
common_route.use(bodyParser.json());
common_route.use(bodyParser.urlencoded({extended:true}));

const auth = require("../middlewares/Auth");
const commonController = require("../controllers/CommonController");

common_route.post('/data_count',auth,commonController.data_count);

module.exports = common_route;
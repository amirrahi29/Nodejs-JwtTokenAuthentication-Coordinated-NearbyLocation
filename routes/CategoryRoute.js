const express = require("express");
const category_route = express();

const bodyParser = require("body-parser");
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({extended:true}));

const auth = require("../middlewares/Auth");
const categoryController = require("../controllers/CategoryController");

category_route.post('/add_category',auth,categoryController.add_category);
category_route.get('/all_category',auth,categoryController.allCategories);

module.exports = category_route;
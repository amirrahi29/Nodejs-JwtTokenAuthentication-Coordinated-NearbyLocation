const express = require('express');
const sub_category_route = express();

const bodyParser = require('body-parser');
sub_category_route.use(bodyParser.json());
sub_category_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middlewares/Auth');
const subCategoryController = require("../controllers/SubCategoryController");

sub_category_route.post('/add_sub_category',auth,subCategoryController.add_sub_category);

module.exports = sub_category_route;
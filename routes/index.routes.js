const router = require("express").Router();
const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const Checkout = require('../models/Checkout.model');

/* GET home page */
router.get("/",async (req, res, next) => {
  try {
    const products = await Product.find();
    const categories = await Category.find();
    res.render('index', {products,categories});
  } catch (error) {
    next (error);
  } 
});

/* GET home page */
router.post("/search",async (req, res, next) => {
  try {
    const products = await Product.find({prodDesc:req.body.prodSearch});
    console.log(req.body.prodSearch);
    const categories = await Category.find();
    res.render('index', {products,categories});
  } catch (error) {
    next (error);
  } 
});

router.use('/products', require('./prod.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/category', require('./cat.routes'));
router.use('/checkout', require('./checkout.routes'));


module.exports = router;

const router = require("express").Router();
const Product = require('../models/Product.model');
const Checkout = require('../models/Checkout.model');

/* GET home page */
router.get("/",async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('index', {products});
  } catch (error) {
    next (error);
  } 
});

router.use('/products', require('./prod.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/checkout', require('./checkout.routes'));

module.exports = router;

const { json } = require('express/lib/response');
const { response } = require('../app');
const { array } = require('../config/cloudinary.config');
const { findByIdAndUpdate } = require('../models/Checkout.model');
const Checkout = require('../models/Checkout.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const stripe_sk = require("stripe") (process.env.STRIPE_SK);
const router = require('express').Router();

// GET: add a product to the shopping cart when "Add to cart" button is pressed
router.get("/checkout-list", async (req, res, next) => {   
  let user_cart, product_cart;
    try {
      // get the correct cart, either from the db, session, or an empty cart.
      if (req.session.currentUser) {       
        user_cart = await Checkout.find({"user" : req.session.currentUser._id})
                                .populate('user')
                                .populate({
                                  path:'products',
                                  populate: {
                                    path:'product',
                                    model:'Product',
                                  },                                                                 
                                });     
      }

      console.log('user-cart1',user_cart);
      res.render('checkout/checkout-list', {user_cart});     
    } catch (err) {
      next(err);     
    }
  });
  
  router.get("/checkout-initiate", async (req,res, next) => {
    res.render('checkout/checkout-initiate');
  })

  router.post("/create-payment-intent", async (req, res, next) => {
    try {
      let user_cart;
      console.log('req_session', req.session.currentUser);
      if (req.session.currentUser) {       
        user_cart = await Checkout.find({"user" : req.session.currentUser._id})
                                .populate('user')
                                .populate({
                                  path:'products',
                                  populate: {
                                    path:'product',
                                    model:'Product',
                                  },                                                                 
                                });    
                                
        console.log('user_cart4',user_cart.totalCost);
      }

      console.log('total_cost',user_cart.totalCost);
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe_sk.paymentIntents.create({
        amount: 132,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });    
      res.send({
        clientSecret: paymentIntent.client_secret,
      });

    } catch (error) {
      next(error);
    };    
  });


  router.post("/:id", async (req, res, next) => {
    const productId = req.params.id;
    try {
      // get the correct cart, either from the db, session, or an empty cart.
      let user_cart, user_product_cart, product_cart;
      console.log('reached1');
      console.log('ProductId', productId);
      if (req.session.currentUser) {
        user_cart = await Checkout.findOne({ "user" : req.session.currentUser._id});
        user_product_cart = await Checkout.findOne({$and:[{ "user" : req.session.currentUser._id}, {"products.product" :productId}]});
        product_cart = await Product.findById(productId);
      }
      console.log('user-cart',user_cart);
      console.log('product-cart',product_cart);
      console.log('user-product-cart',user_product_cart);
      let cart;
      
     // const {prodName, prodDesc,prodCategory,prodImage,prodPrice,prodStock} = req.body;
      if (!user_cart) {
        await Checkout.create({
          products: [{
            product: `${productId}`,
            qty: 1,
            price: product_cart.prodPrice,
            totlineCost : product_cart.prodPrice,
          }],
          user: req.session.currentUser._id,
          totalQty: 1,
          totalCost: product_cart.prodPrice,
          orderCompleted: false,
        });
        console.log('Product and User Creation Process');
      }   
      else if (user_product_cart) {

        let arrayIndex = 0;
        let vartotalQty = 0;
        let vartotalCost = 0;
        for (let i=0; i< user_product_cart.products.length; i++)  {
            vartotalQty = vartotalQty + user_product_cart.products[i].qty;
            vartotalCost = vartotalCost + (user_product_cart.products[i].qty * user_product_cart.products[i].price);
          }
         
        for (let i=0; i< user_product_cart.products.length; i++)  {
          if (user_product_cart.products[i].product == productId) {
            arrayIndex = i;
            break;
          }
        }  
        vartotalQty = vartotalQty + 1;
        vartotalCost = vartotalCost +  ((user_product_cart.products[arrayIndex].qty)*user_product_cart.products[arrayIndex].price);
        console.log('arrayIndex',arrayIndex);
        await Checkout.findOneAndUpdate({$and:[{ "user" : req.session.currentUser._id}, {"products.product" :productId}]},
        {'$set': {
          'products.$.product': `${productId}`,
          'products.$.qty' : user_product_cart.products[arrayIndex].qty+1,
          'products.$.price' :product_cart.prodPrice,
          'products.$.totlineCost':(user_product_cart.products[arrayIndex].qty+1)*product_cart.prodPrice,
          'totalQty': vartotalQty, //user_product_cart.totalQty+1,
          'totalCost':vartotalCost, //(user_product_cart.totalQty+1)*product_cart.prodPrice
        },         
        },
        {
          new:true
        })
        console.log('Product Updation Process');
      }
      else {
        await Checkout.findOneAndUpdate({ "user" : req.session.currentUser._id},
        {
          $push :{products: {$each:[{product:`${productId}`, qty:1,price:product_cart.prodPrice,totlineCost:product_cart.prodPrice}]}},
          totalQty:user_cart.totalQty + 1,
          totalCost:user_cart.totalCost + product_cart.prodPrice
        },
        {
          new:true
        })
        console.log('Product Addition Process');
      }   
      res.redirect("/products");
    } catch (err) {
      console.log(err.message);     
    }
  });

  module.exports = router;
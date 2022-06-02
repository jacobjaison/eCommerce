const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');


router.get('/checkout', isLoggedIn, (req, res, next) => {
    console.log('processing the get checkout...');
  
    if (!req.session.cart) {
      return res.redirect('/shopping-cart');
    }
  
    console.log('req.session.cart: ', req.session.cart);
  
    const cart = new Cart(req.session.cart);
    const errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg})
  })
  
  router.post('/checkout', isLoggedIn, (req, res, next) => {
    console.log('processing the post checkout...');
  
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    const cart = new Cart(req.session.cart);
    
    console.log('created the cart...');
})
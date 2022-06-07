const { json } = require('express/lib/response');
const { findByIdAndUpdate } = require('../models/Checkout.model');
const Checkout = require('../models/Checkout.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
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

    //  user_cart = await Checkout.find();

     // console.log(JSON.parse(JSON.stringify(user_cart)));
     //console.log(Object.values(user_cart.products));
      
      console.log('user-cart1',user_cart);
      res.render('checkout/checkout-list', {user_cart});     
    } catch (err) {
      next(err);     
    }
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
        for (let i=0; i< user_product_cart.products.length; i++)  {
          if (user_product_cart.products[i].product == productId) {
            arrayIndex = i;
            break;
          }
        }  
        console.log('arrayIndex',arrayIndex);
        await Checkout.findOneAndUpdate({$and:[{ "user" : req.session.currentUser._id}, {"products.product" :productId}]},
        {'$set': {
          'products.$.product': `${productId}`,
          'products.$.qty' : user_product_cart.products[arrayIndex].qty+1,
          'products.$.price' :product_cart.prodPrice,
          'totalQty': user_product_cart.totalQty+1,
          'totalCost':(user_product_cart.totalQty+1)*product_cart.prodPrice
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
          $push :{products: {$each:[{product:`${productId}`, qty:1,price:product_cart.prodPrice}]}},
          totalQty:user_cart.totalQty+1,
          totalCost: (user_cart.totalQty+1)*product_cart.prodPrice

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

      /*let cart;
      if (
        (req.user && !user_cart && req.session.cart) ||
        (!req.user && req.session.cart)
      ) {
        cart = await new Checkout(req.session.cart);
      } else if (!req.user || !user_cart) {
        cart = new Checkout({});
      } else {
        cart = user_cart;
      }
  
      // add the product to the cart
      const Product = await Product.findById(productId);
      const itemIndex = cart.products.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        // if product exists in the cart, update the quantity
        cart.products[itemIndex].qty++;
        cart.products[itemIndex].prodPrice = cart.products[itemIndex].qty * Product.prodPrice;
        cart.totalQty++;
        cart.totalCost += Product.prodPrice;
      } else {
        // if product does not exists in cart, find it in the db to retrieve its price and add new item
        cart.products.push({
          productId: productId,
          prodQuantity: 1,
          prodPrice: prodPrice,
        });
        cart.totalQty++;
        cart.totalCost += prodPrice;
      }
  
      // if the user is logged in, store the user's id and save cart to the db
      if (req.user) {
        cart.user = req.user._id;
        await cart.save();
      }
      req.session.cart = cart;
      req.flash("success", "Item added to the shopping cart");
      res.redirect('/checkout', {cart})
     // res.redirect(req.headers.referer);
    } catch (err) {
      console.log(err.message);
      res.redirect("/");
    }
  });
  
  // GET: view shopping cart contents
  router.get("/shopping-cart", async (req, res) => {
    try {
      // find the cart, whether in session or in db based on the user state
      let cart_user;
      if (req.user) {
        cart_user = await Cart.findOne({ user: req.user._id });
      }
      // if user is signed in and has cart, load user's cart from the db
      if (req.user && cart_user) {
        req.session.cart = cart_user;
        return res.render("shop/shopping-cart", {
          cart: cart_user,
          pageName: "Shopping Cart",
          products: await productsFromCart(cart_user),
        });
      }
      // if there is no cart in session and user is not logged in, cart is empty
      if (!req.session.cart) {
        return res.render("shop/shopping-cart", {
          cart: null,
          pageName: "Shopping Cart",
          products: null,
        });
      }
      // otherwise, load the session's cart
      return res.render("shop/shopping-cart", {
        cart: req.session.cart,
        pageName: "Shopping Cart",
        products: await productsFromCart(req.session.cart),
      });
    } catch (err) {
      console.log(err.message);
      res.redirect("/");
    }
  });
  */

  module.exports = router;
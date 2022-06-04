const Checkout = require('../models/Checkout.model');
const User = require('../models/User.model');
const router = require('express').Router();

// GET: add a product to the shopping cart when "Add to cart" button is pressed
router.get("/add-to-cart/:id", async (req, res) => {
    const productId = req.params.id;
    try {
      // get the correct cart, either from the db, session, or an empty cart.
      let user_cart;
      if (req.user) {
        user_cart = await Checkout.findOne({ user: req.user._id });
      }
      let cart;
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
      res.redirect(req.headers.referer);
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


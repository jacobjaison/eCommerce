const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
//const middleware = require("../middleware");
//const updloader = require('../config/cloudinary.config');
const SALT_FACTOR = 12;

const router = express.Router();


// GET: display the signup form 

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})


// POST: handle the signup logic
router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.file);
  if(!email || !password){
    return res.render('auth/signup', {
      errorMessage: "Credentials are mandatory!"
    })
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
  if(!regex.test(password)){
    return res.render('auth/signup', {
      errorMessage: "Password needs to have 8 char, including lower/upper case and a digit"
    })
  }

  try {
    const foundUser = await User.findOne({ email });

    if(foundUser){
      return res.render('auth/signup', {
        errorMessage: "Email already in use"
      })
    }

    const hashedPassword = bcrypt.hashSync(password, SALT_FACTOR);
    await User.create({
      email, 
      password: hashedPassword,
      profilePic: req.file.path
    })

    res.redirect('/auth/login');

  } catch (error) {
    next(error);
  }
})

  async (req, res) => {
    try {
      //if there is cart session, save it to the user's cart in db
      if (req.session.cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }
      // redirect to the previous URL
      if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  };

// GET: display the signin form 

router.get('/signin', (req, res, next) => {
  res.render('auth/signin');
})

// POST: handle the signin logic

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.render('auth/login', {
      errorMessage: "Credentials are mondatory!"
    })
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
  if(!regex.test(password)){
    return res.render('auth/login', {
      errorMessage: "Password needs to have 8 char, including lower/upper case and a digit"
    })
  }

  try {
    const foundUser = await User.findOne({ email });

    if(!foundUser){
      return res.render('auth/signin', {
        errorMessage: "Wrong credentials"
      })
    }

    const checkPassword = bcrypt.compareSync(password, foundUser.password);
    if(!checkPassword){
      return res.render('auth/signin', {
        errorMessage: "Wrong credentials"
      })
    }

    const objectUser = foundUser.toObject();
    delete objectUser.password;
    req.session.currentUser = objectUser;

    return res.redirect('/');
  } catch (error) {
    
  }
},
  async (req, res) => {
    try {
      // cart logic when the user logs in
      const cart = await Cart.findOne({ user: req.user._id });
      // if there is a cart session and user has no cart, save it to the user's cart in db
      if (req.session.cart && !cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }
      // if user has a cart in db, load it to session
      if (cart) {
        req.session.cart = cart;
      }
      // redirect to old URL before signing in
      if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);

// GET: display user's profile
router.get("/profile", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  try {
    // find all orders of this user
    allOrders = await Order.find({ user: req.user });
    res.render("user/profile", {
      orders: allOrders,
      errorMsg,
      successMsg,
      pageName: "User Profile",
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});
// GET: logout
router.get("/logout", (req, res) => {
  req.logout();
  req.session.cart = null;
  res.redirect("/");
});
module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const upLoader = require('../config/cloudinary.config');
const isLoggedIn = require("../middlewares/isLoggedIn");
const SALT_FACTOR = 12;
const router = express.Router();

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.render("auth/logout", {
				errorMessage: err.message,
			})
		}
		res.redirect("/")
	})
})

// GET: display the signup form 
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})

// POST: handle the signup logic
router.post('/signup', upLoader.single('profilePic'), async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, profilePic, addressLine1, addressLine2, couResidence, couCity, postalCode } = req.body;
    console.log(firstName);
    if (!email || !password) {
      return res.render('auth/signup', {
        errorMessage: "Credentials are mandatory!"
      })
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
    if (!regex.test(password)) {
      return res.render('auth/signup', {
        errorMessage: "Password needs to have 8 char, including lower/upper case and a digit"
      })
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.render('auth/signup', {
        errorMessage: "Email already in use"
      })
    }
    const hashedPassword = bcrypt.hashSync(password, SALT_FACTOR);
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePic: req.file.path,
      address: [{
        addressLine1,
        addressLine2,
        couResidence,
        couCity,
        postalCode
      }]
    });

    res.redirect('/auth/signin');

  } catch (error) {
    next(error);
  }
})
  
// GET: display the signin form 

router.get('/signin', (req, res, next) => {
  res.render('auth/signin');
})

// POST: handle the signin logic

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.render('auth/signin', {
      errorMessage: "Credentials are mandatory!"
    })
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
  if(!regex.test(password)){
    return res.render('auth/signin', {
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
    console.log(req.session.currentUser.firstName);
    console.log(req.session.currentUser._id);
    
   // document.getElementById("displayName").innerText = "Welcome, " + req.session.currentUser.firstName;
    return res.redirect('/');
  } catch (error) {
    next(error)
  }
});


module.exports = router;
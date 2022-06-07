const express = require("express");
const User = require("../models/User.model");
const upLoader = require('../config/cloudinary.config');
const router = express.Router();

// GET: display the signup form 
router.get('/users-edit', async (req, res, next) => {
    try {
        const id = req.session.currentUser._id
        const user = await User.findById(id);
        res.render('users/users-edit', user);
    } catch (error) {
        next (error);
    }    
  });
router.post('/users-edit',upLoader.single('profilePic'), async(req,res,next) => {
    try {
        const id = req.session.currentUser._id;
        const { firstName, lastName, email, profilePic, addressLine1, addressLine2, couResidence, couCity, postalCode } = req.body;
        console.log(firstName);
        if (!email) {
          return res.render('users/users-edit', {
            errorMessage: "Email is mandatory!"
          })
        }       
        await User.findByIdAndUpdate(id,
            {
                firstName,
                lastName,
                email,
                profilePic: req.file.path,
                address: [{
                    addressLine1,
                    addressLine2,
                    couResidence,
                    couCity,
                    postalCode
                }]
            });    
        res.redirect('/');
    
      } catch (error) {
        next(error);
      }
})
module.exports = router;
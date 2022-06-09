const app = require("../app");

const isLoggedIn = (req,res,next) => {    
      if(req.session.currentUser) {
        console.log('if current user');        
        next();
      } else {
        console.log('else logged in')      
        return res.redirect("/auth/signin");
      }    
  }
  module.exports = isLoggedIn
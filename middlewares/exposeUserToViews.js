const app = require("../app")

const exposeUsers = (req, res, next) => {
	if (req.session.currentUser) {
		res.locals.currentUser = req.session.currentUser;
       // app.locals.userTitle = req.session.currentUser;
		res.locals.isLoggedIn = true;
        
	}

	console.log("Inside exposeUsers")
	next()
}
module.exports = exposeUsers

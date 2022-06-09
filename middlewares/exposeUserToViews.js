const app = require("../app")

const exposeUsers = (req, res, next) => {
	if (req.session.currentUser) {
        if (req.session.currentUser.isAdmin) {
            res.locals.isAdmin = true
        }
		res.locals.currentUser = req.session.currentUser;
       // app.locals.userTitle = req.session.currentUser;
		res.locals.isLoggedIn = true;
        res.locals.firstName = req.session.currentUser.firstName;
        
	}

	console.log("Inside exposeUsers")
	next()
}
module.exports = exposeUsers

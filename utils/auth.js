const withAuth = (req, res, next) => {
    console.log('withAuth working', req.session);
    if(!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        next();
    }
}

module.exports = withAuth; 
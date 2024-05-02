const checkIfAuthenticated = (req,res,next)=>{
    if (req.session.user){
        next();
    } else {
        req.flash('error_messages', "Sorry you need to login to access this page.");
        res.status(401);
        res.redirect('/users/login');
    }
}

module.exports = {checkIfAuthenticated};
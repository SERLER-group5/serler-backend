module.exports = function(req, res, next){
    if(req.user.role === 'User') return res.status(403).send('Access Denied');
    next();
}
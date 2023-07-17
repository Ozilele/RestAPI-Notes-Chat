const { verifyJwt } = require('../config/jwt.js');

const isLoggedIn = (req, res, next) => {
  const token = req?.headers?.authorization?.replace('Bearer ', "");
  if(token === 'undefined' || !token) { // Nie ma nagłówka uwierzytelniania)
    req.user = null;
  }
  else { // Proces weryfikacji tokenu
    const verification =  verifyJwt(token);
    if(verification.valid) {
      const userID = verification.decoded.userId;
      req.user = userID;
    } else {
      req.user = null;
    }
  }
  next();
}

module.exports = { isLoggedIn }
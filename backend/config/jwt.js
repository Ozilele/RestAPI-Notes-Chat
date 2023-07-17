const jwt = require("jsonwebtoken");
const fs = require('fs');
require('dotenv').config();

const pri = fs.readFileSync('./private_key.pem', 'utf-8');
const pub = fs.readFileSync('./public_key.pem', 'utf-8');

const signJwt = (object, options) => {
  const token = jwt.sign(object, pri, { // signing token, object is the google user's data which is stored in db 
    ...(options && options),
    algorithm: "RS256",
  });
  return token;
}

const verifyJwt = (token) => {
  
  try {
    const decoded = jwt.verify(token, pub, { algorithms: ['RS256'] });
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch(err) {
    return {
      valid: false,
      expired: err.message === 'jwt expired',
      decoded: null,
    };
  }
}

module.exports = { signJwt, verifyJwt };
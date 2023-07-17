const dotenv = require('dotenv');
dotenv.config();

const googleClientId = process.env.Google_Client_Id;
const googleClientSecret = process.env.Google_Client_Secret;

const googleOauthRedirectUri = "http://localhost:8000/login/oauth/google";

module.exports = { googleClientId, googleClientSecret, googleOauthRedirectUri };
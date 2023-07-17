const express = require('express');
const { googleClientId, googleClientSecret, googleOauthRedirectUri } = require('../config/oauth.js');
const qs = require('qs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const userModel = require('../model/userModel.js');
const { signJwt } = require('../config/jwt.js');

const router = express.Router();

const getGoogleOAuthTokens = async (code) => { // function returning id and access token 
  const url = "https://oauth2.googleapis.com/token"

  const values = {
    code,
    client_id: googleClientId,
    client_secret: googleClientSecret,
    redirect_uri: googleOauthRedirectUri,
    grant_type: 'authorization_code',
  }

  try { // querystring konwertuje obiekt z danymi na ciąg znaków, który moze być uzyty jako parametry w adresie URL
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return res.data;
  }
  catch(err) {
    console.log(err.message);
    console.log(err.response.data.error);
  }
}

router.get("/oauth/google", async (req, res) => { // function for handling
  // get the code from query string
  const code = req.query.code;
  
  try {    
    // get id and access token with the code
    const { id_token, access_token } = await getGoogleOAuthTokens(code);
    // get a user with tokens
    const googleUser = jwt.decode(id_token);
    console.log({ googleUser }); // returning data of google user based on the id_token
    // upsert a user
    if(!googleUser) {
      return res.status(403).send("Error decoding google user's token");
    }
    const name = googleUser.given_name;
    const surname = googleUser.family_name;
    const email = googleUser.email;
    const picture = googleUser.picture;
    const user_id = googleUser.sub;
    
    let user;
    const userSaved = await userModel.findOne({ email });
    if(!userSaved) { // insert user to database
      try {
        const newUser = await userModel.create({
          name,
          surname,
          email,
          picture,
          identifier: user_id,
        });
        user = newUser;
      } catch(err) {
        console.log(err);
      }
    } else {
      user = userSaved;
    }
    // create a session (not implemented)
    // create access & refresh tokens
    const accessToken = signJwt({userId: user._id, email: user.email}, {
      expiresIn: 900000,
    });

    const accessTokenCookieOptions = { // access token options (stands for 15 minutes)
      maxAge: 90000000,
      domain: "localhost",
      httpOnly: false,
      secure: true,
      sameSite: "strict",
    }

    const refreshToken = signJwt({userId: user._id, email: user.email}, {
      expiresIn: 3.154e10,
    });

    const refreshTokenCookieOptions = {
      ...accessTokenCookieOptions,
      maxAge: 3.154e10,
    };

    // set cookies
    res.cookie("accessToken", accessToken, accessTokenCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
    // redirect to client
    return res.redirect("http://localhost:3000");
  } catch(err) {
    if(err) throw err;
    res.status(500).json('error');
  }
});

module.exports = router;

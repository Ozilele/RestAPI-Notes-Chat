const express = require('express');
const User = require('../model/userModel.js');
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, {'_id': 1, email: 1});
    if(users) {
      return res.status(201).json({
        users,
        message: 'Successfully found all users',
      });
    } else {
      return res.status(401).json({
        message: 'No users found',
      });
    }
  } catch(err) {
    return res.status(500).json({
      message: "Network connection problem"
    });
  }
});

module.exports = router;
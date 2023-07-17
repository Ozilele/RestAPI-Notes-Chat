const express = require('express');
const Message = require('../model/messageModel.js');
const router = express.Router();

router.get("/", async (req, res) => {
  console.log(req.query);
  const { user, recipient } = req.query;

  try {
    const messages = await Message.find({ $or: [
      { sender: user, recipient: recipient },
      { sender: recipient, recipient: user }]
    });
    if(messages.length > 0) {
      return res.status(201).json({
        messages,
        info: "Some messages found",
      });
    } else if(messages.length == 0) {
      return res.status(201).json({
        info: "No messages found",
      });
    } else {
      return res.status(400).json({
        info: 'Error getting messages'
      })
    }
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      info: 'Connection problem'
    });
  }
});

module.exports = router;
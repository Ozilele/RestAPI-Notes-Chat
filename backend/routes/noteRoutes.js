const express = require('express');
const { verifyJwt } = require('../config/jwt.js');
const noteModel = require('../model/noteModel.js');
const userModel = require('../model/userModel.js');
const { isLoggedIn } = require('../middleware/isLoggedIn.js');
const { areNotesQueries } = require('../middleware/areQueries.js');
const mongoose = require('mongoose');

const router = express.Router();

router.get("/", isLoggedIn, areNotesQueries, async (req, res) => {
  console.log(req.user);
  
  if(req.filters.length > 0) {
    try {
      const queriedNotes = await noteModel.find({ $and: req.filters });
      if(queriedNotes) {
        return res.status(201).json({
          notes: queriedNotes,
          message: "Notes found",
        });
      } else {
        return res.status(401).json({
          message: "Notes not found :("
        });
      }
    } catch(err) {
      console.log(err);
    }
  }

  if(req.user) { // Authorized user
    const userExists = await userModel.findById(req.user);
    if(userExists) {
      const userNotes = await noteModel.find({ author: new mongoose.Types.ObjectId(req.user) });
      if(userNotes.length > 0) {
        return res.status(201).json({
          notes: userNotes,
          user: {
            userId: userExists._id,
            email: userExists.email,
            picture: userExists.picture,
            name: userExists.name,
          },
          message: "Notes found"
        });
      } else if(userNotes.length == 0) {
        return res.status(201).json({
          notes: [],
          user: {
            userId: userExists._id,
            email: userExists.email,
            picture: userExists.picture,
            name: userExists.name,
          },
          message: "Notes not found :(",
        });
      } else {
        return res.status(500).json({
          message: "Connection problem",
        });
      } 
    }
  } else if(req.user == null) {
    let notes;
    notes = await noteModel.find();
    if(notes) {
      return res.status(201).json({
        notes: notes,
        message: "Notes found"
      });
    } else {
      return res.status(401).json({
        message: "Notes not found :("
      });
    } 
  }
});

router.get("/:id", async (req, res) => {
  const noteID = req.params.id;
  console.log(noteID);
  const note = noteModel.findById(noteID);
  if(note != null) {
    return res.status(201).json({
      note: note,
      message: "ID",
    });
  } else {
    return res.status(401).json({
      message: "Error finding this note"
    });
  }
});

router.post("/", isLoggedIn, async (req, res) => {
  const { title, content, category, subject } = req.body;
  if(!title || !content) {
    return res.status(401).json({
      message: "Please add all the fields"
    });
  }
  let note;
  if(req.user) {
    note = await noteModel.create({
      title, 
      content,
      author: req.user,
      category: category !== "" ? category : null,
      subject: subject !== "" ? subject : null,
    });
  } else {
    note = await noteModel.create({
      title,
      content,
      category: category !== "" ? category : null,
      subject: subject !== "" ? subject : null,
    });
  }

  if(note) {
    res.status(201).json({
      message: "Added new note",
      newNote: note,
    });
  }
  else {
    res.status(401).json({
      message: "Invalid data"
    });
  }
});

router.put("/:id", async (req, res) => {
  const noteID = req.params.id;
  const { title, content } = req.body;

  const note = await noteModel.findById(noteID);
  if(!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  note.title = title;
  note.content = content;
  await note.save();

  return res.status(201).json({
    updatedNote: note,
    message: "Updated note data successfully"
  });
});

router.delete("/:id", async (req, res) => {
  const noteID = req.params.id;
  console.log(noteID);
  const status = await noteModel.deleteOne({ _id: noteID });

  if(status) {
    return res.status(201).json({
      message: "Successfully deleted note"
    });
  } else {
    return res.status(400).json({
      message: "Error deleting a note"
    });
  }
});

module.exports = router;


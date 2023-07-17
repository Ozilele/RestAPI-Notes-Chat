const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./config/db.js');
const loginRouter = require('./routes/loginRoutes.js');
const notesRouter = require('./routes/noteRoutes.js');
const messageRouter = require('./routes/messageRoutes.js');
const usersRouter = require('./routes/userRoutes.js');
const User = require('./model/userModel.js');
const { isLoggedIn } = require('./middleware/isLoggedIn.js');
const { verifyJwt } = require('./config/jwt.js');
const Message = require('./model/messageModel.js');
const fs = require('fs');
const ws = require('ws');

connectToDb();

const PORT = 8000;
const app = express();
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors()); // using cross for single application secure http requests
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // gdy klient wysyła formularz z metodą post, dane są przesyłane w formacie URL-encoded, ten middleware umieszcza te dane w obiekcie req.body

app.use('/auth', isLoggedIn, async (req, res) => {
  if(req.user) {
    const userExists = await User.findById(req.user);
    if(userExists) {
      return res.status(201).json({
        user: {
          userId: userExists._id,
          email: userExists.email,
          picture: userExists.picture,
          name: userExists.name,
        },
      });    
    }
  } else {
    res.status(401).json({
      message: "Not authorized"
    });
  }
});
app.use('/logout', (req, res) => {
  res.cookie("accessToken", "", {});
  res.cookie("refreshToken", "", {});
  // return res.status(200).json('ok');
  return res.redirect("http://localhost:3000");
});
app.use("/login", loginRouter);
app.use("/note", notesRouter);
app.use("/users", usersRouter);
app.use("/messages", messageRouter);

const server = app.listen(PORT, () => {
  console.log(`Connected to backend server on port ${PORT}`);
});

const wss = new ws.WebSocketServer({ server }); // web socket server

wss.on('connection', (connection, req) => {

  const notifyAboutOnlinePeople = () => {
    [...wss.clients].forEach(client => { // sending information about online people to all clients
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId: c.userId, email: c.email}))
      }));
    });
  }

  connection.isAlive = true; // after someone connects connection isAlive

  connection.timer = setInterval(() => {
    connection.ping();
    // After sending ping 
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate(); // terminating connection
      notifyAboutOnlinePeople();
      console.log('dead');
    }, 1000);
  }, 5000);

  // Client receiving ping message(ping - pong)
  connection.on('pong', ()=> {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie; 
  if(cookies) { // user authentication
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('accessToken='));
    if(tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if(token) {
        const tokenVerification = verifyJwt(token);
        if(tokenVerification.valid) {
          const { userId, email } = tokenVerification.decoded;
          connection.userId = userId;
          connection.email = email;
        } else {
          return tokenVerification.expired;
        }
      }
    }
  }
  // Receiving message which was sent by the client(connection.userId)
  connection.on('message', async (message) => { 
    // Parsing all data from the received message
    const messageData = JSON.parse(message.toString()); 
    const { recipient, text, file } = messageData;
    let filename = null;
    if(file) {
      const parts = file.info.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + '.' + ext;
      const path = __dirname + '/uploads/' + filename;
      // Bufor w formie danych binarnych na podstawie zdekodowanych danych 
      const bufferData = new Buffer.from(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log('File saved ' + path);
      });
    }
    if(recipient && (text || file)) {
      // Saving message to db
      const msgDoc = await Message.create({ 
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      console.log("Server" + Date.now());
      // Notifying the recipient of the message that a message was sent
      [...wss.clients]
        .filter(c => c.userId === recipient) // filter because one user can have multiple devices
        .forEach(c => c.send(JSON.stringify({
          text,
          recipient,
          file: file ? filename : null,
          sender: connection.userId,
          _id: msgDoc._id
        }))) ;
    }
  });

  notifyAboutOnlinePeople();
});

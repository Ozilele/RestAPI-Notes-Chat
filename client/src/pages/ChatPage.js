import React, { useEffect, useRef, useState } from 'react'
import './ChatPage.css';
import SendIcon from '@mui/icons-material/Send';
import { green, pink, deepOrange, deepPurple, blue } from '@mui/material/colors';
import ContactsIcon from '@mui/icons-material/Contacts';
import { Avatar, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import axios from 'axios'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { login, selectUser } from '../state_slices/userSlice';
import { motion } from "framer-motion"
import CloseIcon from '@mui/icons-material/Close';
import Contact from '../components/Contact/Contact';
import Cookies from 'js-cookie';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 }
  },
  closed: { // stagger from bottom to top when closed
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
}

const avatarColors = [
  green[500],
  pink[500],
  deepOrange[500],
  green[500],
  deepPurple[500],
]

const ChatPage = () => {
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setUserId] = useState(null);
  const [ws, setWS] = useState(null);
  const user = useSelector(selectUser);
  const [msgText, setMsgText] = useState('');
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();
  const divUnderMessage = useRef();
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const { accessToken } = Cookies.get();
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}` // dodanie tokenu do nagłówka zapytania
      }
    }
    axios.get("/auth", config).then(res => {
      if(res.data.user) {
        dispatch(login(res.data.user));
        connectToWs();
      } else {
        console.log(res);
        // Error(Get logged in)
      } 
    }).catch((err) => {
      console.log(err); 
      // Przekierowanie do strony logowania po stronie klienta
      window.location = "/login";
    });
  }, []);

  const connectToWs = () => {
    const ws = new WebSocket('ws://localhost:8000');
    setWS(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => { // connection gets lost, trying to reconnect
      setTimeout(() => {
        console.log('Disconnected. Trying to reconnect');
        connectToWs();
      }, 1000);
    });
  }

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, email }) => {
      people[userId] = email;
    });
    console.log(people);
    setOnlinePeople(people);
  }

  // function for handling the response from the websocket server
  const handleMessage = (e) => { 
    const messageData = JSON.parse(e.data);

    if('online' in messageData) {
      showOnlinePeople(messageData.online);
    }
    // ws server has sent a notification about the message to curr client
    else if('text' in messageData) { 
      if(messageData.sender === selectedUserId) {
        setMessages(messages => {
          return [
            ...messages,
            {...messageData}
          ]
        });
      }
    }
  }

  // Function for sending a message to another person
  const sendMessage = async (e, file = null) => {
    if(e) {
      e.preventDefault();
    }
    // Sending data about the message to server
    await ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: msgText,
      file,
    }));
  
    if(file) { // if we are sending file we need to query db for the link of file
      console.log(Date.now());
      setTimeout(async() => {
        const API_URL = `/messages?user=${user.userId}&recipient=${selectedUserId}`;
        const response = await axios.get(API_URL);
        console.log(response);
        if(response.data.messages.length > 0) {
          setMessages(response.data.messages);
        } else if(response.data.info === "No messages found") {
          setMessages([]);
        }
      }, 2000);
    } else {
      setMsgText('');
      setMessages(prevMsg => {
        return [
          ...prevMsg,
          {
            text: msgText, 
            sender: user.userId,
            recipient: selectedUserId,
            _id: Date.now(),
          },
        ]
      });
    }
  } 

  const sendFile = (ev) => {
    console.log(ev.target.files[0]);
    // Konwertowanie zdjęć na format base 64 - konwertowanie ciągu bajtów na ciąg znaków
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        info: ev.target.files[0].name,
        data: reader.result, // file's data as a base64 encoded string
      });
    }
  }

  // useEffect for getting all the users to set offline users
  useEffect(() => {
    axios.get('/users').then(res => {
      const offlinePeopleArr = res.data.users
        .filter(user => user._id !== user.userId)
        .filter(user => !Object.keys(onlinePeople).includes(user._id)); 
      console.log(offlinePeopleArr);
      const offlinePeople = {};
      offlinePeopleArr.forEach(p => {
        offlinePeople[p._id] = p.email;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  // useEffect for scrolling to the bottom when message was sent/received
  useEffect(() => {
    const div = divUnderMessage.current; // accessing dom element
    if(div) {
      div.scrollIntoView({behavior: 'smooth', block: 'end'});
    }
  }, [messages]);

  // useEffect for viewing all the messages between users
  useEffect(() => {
    async function makeRequest() {
      if(selectedUserId) {
        const API_URL = `/messages?user=${user.userId}&recipient=${selectedUserId}`;
        const response = await axios.get(API_URL);
        console.log(response);
        if(response.data?.messages?.length > 0) {
          setMessages(response.data.messages);
        } else if(response.data.info === "No messages found") {
          setMessages([]);
        }
      }
    }
    makeRequest();
  }, [selectedUserId]);

  // useEffect for monitoring width of screen to handle sidebar
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
      if(window.innerWidth <= 830) {
        setSidebarVisible(false);
      }
      if(window.innerWidth >= 831) {
        setSidebarVisible(true);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const onlinePeopleExcludingMe = {...onlinePeople};
  delete(onlinePeopleExcludingMe[user.userId]);
  const messagesWithoutDups = uniqBy(messages, '_id'); // unique messages without duplicates

  const sidebarContainerRef = useRef();

  return (
    <div className='chat-page'>
      <div onClick={() => setSidebarVisible(!isSidebarVisible)} className='burger-sidebar'>
        {!isSidebarVisible ? <IconButton style={{backgroundColor: 'whitesmoke'}} className='btn-burger'>
          <MenuRoundedIcon/>
        </IconButton> : <IconButton style={{backgroundColor: 'whitesmoke'}} className='btn-burger'>
          <CloseIcon/>
        </IconButton>} 
      </div>
      <motion.div
        custom={windowSize[1]}
        ref={sidebarContainerRef} 
        animate={isSidebarVisible ? "open" : 'closed'} 
        className={`chat-sidebar ${!isSidebarVisible ? 'hidden' : ''}`}>
        <div className='chat-logo'>
          <ContactsIcon/>
          <h3>My Contacts</h3>
        </div>
        <motion.ul variants={variants} className='my-contacts'>
          {Object.keys(onlinePeopleExcludingMe).length > 0 && Object.keys(onlinePeopleExcludingMe).map((key,i) => {
            const userIDBase10 = parseInt(key, 16);
            const avatarColor = avatarColors[userIDBase10 % avatarColors.length]
            return (
              <Contact 
                key={i}
                avatarColor={avatarColor}
                email={onlinePeople[key]}
                selected={selectedUserId === key ? true : false}
                onClick={() => setUserId(key)}
                online={true}
              />            
          )})}
          {Object.keys(offlinePeople).length > 0 && Object.keys(offlinePeople).map((key, i) => {
            const userIDBase10 = parseInt(key, 16);
            const avatarColor = avatarColors[userIDBase10 % avatarColors.length]
            return (
              <Contact 
                key={i}
                avatarColor={avatarColor}
                email={offlinePeople[key]}
                selected={selectedUserId === key ? true : false}
                onClick={() => setUserId(key)}
                online={false}
              /> 
          )})}
        </motion.ul>
        <div className='user-chat-section'>
          <Avatar src={user.picture} />
          <span>{user.email}</span>
        </div>
      </motion.div>
      <div className="chat-content">
        <div className='chat-messages'>
          {!selectedUserId && (
            <div className='messages-non-selected'>&larr; Select a person</div>
          )}
          {(selectedUserId && messagesWithoutDups.length === 0) && 
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }} className='start-chat-conversation'>
              No messages yet. Start a conversation
            </div>
          }
          {selectedUserId && (
              <div className='chat-content-scroll'>
                {messagesWithoutDups.map(message => (
                  <div key={message._id} style={{textAlign: message.sender === user.userId ? 'right' : 'left'}}>
                    <div className='chat-msg' style={
                      {backgroundColor: message.sender === user.userId ? blue[500] : 'black', color: message.sender === user.userId ? 'white' : 'gray'}
                      }>
                      {message.text}
                      {message.file && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AttachFileIcon style={{ width: '20px', height: '20px' }}/>
                          <a target='_blank' style={{ color: 'whitesmoke' }} href={`http://localhost:8000/uploads/${message.file}`}>
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))} 
                <div ref={divUnderMessage}></div>
              </div>
          )}
        </div>
        {selectedUserId &&
          <form onSubmit={sendMessage} className='input-form'>
            <input 
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              className='chat-input' 
              type='text' 
              placeholder='Type your message'/>
            <label className='attach-file-btn'>
              <input onChange={sendFile} type="file" style={{width: 0, visibility: 'hidden', overflow: 'hidden' }}/>
              <AttachFileIcon style={{ transform: 'rotate(45deg)', color: 'grey' }} />
            </label>
            <IconButton onClick={sendMessage} className='send-chat-btn'>
              <SendIcon className='send-chat-icon' />
            </IconButton>
          </form>}
      </div>
    </div>
  )
}


export default ChatPage;

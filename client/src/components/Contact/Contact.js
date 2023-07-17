import React from 'react'
import { green } from '@mui/material/colors';
import { motion } from 'framer-motion';
import UserAvatar from '../UserAvatar/UserAvatar';

const variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      y: { velocity: -100, stiffness: 1000, }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

const Contact = ({ key, avatarColor, email, selected, onClick, online }) => {
  return (
    <motion.li 
      variants={variants}
      key={key}
      onClick={onClick}
      style={selected ? {backgroundColor: green[200]} : {}}
    >
      <UserAvatar isOnline={online} color={avatarColor} content={email[0].toUpperCase()} />
      <span>{email}</span>
    </motion.li>
  )
}

export default Contact
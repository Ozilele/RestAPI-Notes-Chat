import React from 'react'
import { motion } from 'framer-motion';
import './UserDropdown.css';
import axios from 'axios';
import { logout } from '../../state_slices/userSlice';
import { useDispatch } from 'react-redux';

const UserDropdown = ({ isOpen, setIsOpen }) => {

  const dispatch = useDispatch();

  const menu = {
    closed: {
      scale: 0,
      transition: {
        delay: 0.15,
      }
    },
    open: {
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.3,
        delayChildren: 0.2,
        staggerChildren: 0.05,
      }
    }
  }

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
    },
    closed: {
      opacity: 0,
      x: -20,
    },
    transition: { opacity: { duration: 0.25 } },
  };

  const logoutUser = async () => {
    const res = await axios.post('/logout');
    dispatch(logout());
  }

  return (
    <motion.div
      className='user-dropdown'
      initial="closed"
      animate={ isOpen ? "open" : "closed" }
      exit="closed"
      variants={menu}
      >
      <motion.ul
        initial="closed"
        animate={ isOpen ? "open" : "closed"}
        exit="closed"
        variants={menu}
      >
        <motion.li variants={itemVariants}>Profile</motion.li>
        <motion.li variants={itemVariants}>Settings</motion.li>
        <motion.li 
          variants={itemVariants}
          onClick={logoutUser}
        >
          Logout</motion.li>
      </motion.ul>
    </motion.div>
  )
}

export default UserDropdown;
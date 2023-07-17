import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectNoteAuthor } from '../../state_slices/noteSlice';
import { Avatar } from '@mui/material';
import { selectUser } from '../../state_slices/userSlice';
import UserDropdown from '../Dropdown/UserDropdown';

const Header = () => {
  const [dropdownShown, setDropdownShown] = useState(false);
  const loggedUser = useSelector(selectUser);
  
  return (
    <>
      <header className='notes-header'>
        <h1 className='notes-header-h1'>My Notes</h1>
        <nav className='nav-header'>
          <ul className='link-list'>
            <li className='header-link'>
              <Link to="./classes">Classes</Link>
            </li>
            <li className='header-link'>
              <Link to="./calendar">Calendar</Link>
            </li>
            <li className='header-link'>
              <Link className='link-icon' to="./chat">
                <ChatOutlinedIcon/>
              </Link>
            </li>
            <li className='header-link'> 
              <Link className='link-icon' to="./notifications">
                <NotificationsNoneOutlinedIcon/>
              </Link>
            </li>
            <li style={{ cursor: 'pointer' }} onClick={() => setDropdownShown(!dropdownShown)} className='header-link'>
              <Avatar className='avatar--icon' src={loggedUser?.picture} />
            </li>
          </ul>
        </nav>
      </header>
      {Object.keys(loggedUser).length > 0 && <UserDropdown isOpen={dropdownShown} setIsOpen={() => setDropdownShown()}/>}
    </>
  )
}

export default Header

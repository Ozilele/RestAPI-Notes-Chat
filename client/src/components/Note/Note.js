import React from 'react'
import './Note.css';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { deleteOneNote } from '../../state_slices/noteSlice';
import { useDispatch } from 'react-redux';

const Note = ({ id, title, date, content }) => {

  const dispatch = useDispatch();

  const handleClick = async (e) => {
  }

  const formatDate = (date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const day = newDate.getDate();
    const hours = newDate.getHours().toString().padStart(2, '0');
    const minutes = newDate.getMinutes().toString().padStart(2, '0');
    const seconds = newDate.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  const editNote = async (e) => {
    const API_URL = `/note/${id}`;
    const newData = {
      title: "Baltazar",
      content: "Baltazar Zielona Pietruszka wita w krainie czarów"
    }
    const resp = await axios.put(API_URL, newData);
    console.log(resp);
  }

  const deleteNote = (e) => {
    dispatch(deleteOneNote(id));
  }

  return (
    <motion.div 
      key={id} 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.255 }}
      onClick={handleClick} 
      className="single-note"
    >
      <div className='single-note-content'>
        <h2 className='note-title'>{title}</h2>
        <h4 className='note-date'>{formatDate(date)}</h4>
        <p>{content.substring(0, 42) + "..."}</p>
      </div>
      <div className="single-note-btn">
        <button onClick={editNote} className='edit--btn'>
          <EditIcon className='edit-icon'/>
        </button>
        <button onClick={deleteNote} className='delete-btn'>
          <DeleteIcon className='delete-icon'/>
        </button>
      </div>
    </motion.div>
  )
}

export default Note;
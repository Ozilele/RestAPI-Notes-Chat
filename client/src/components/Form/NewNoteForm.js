import React, { useState } from 'react'
import './NewForm.css';
import { useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { animate, motion } from 'framer-motion';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { addNewNote } from '../../state_slices/noteSlice';

const dropIn = {
  hidden: {
    x: "-50%",
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    x: "-50%",
    y: "-50%",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 20,
      stiffness: 300,
    }
  },
  exit: {
    x: "-50%",
    y: "100vh",
    opacity: 0,
  }
}

const NewNoteForm = ({ setModalClass }) => {

  const dispatch = useDispatch();
  const [categoryMenuShown, setCategoryMenu] = useState(false);
  const [subjectMenu, setSubjectMenu] = useState(false);

  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    category: "",
    subject: "",
  });

  const handleInputChange = (e) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name] : e.target.value
      }
    });
  }

  const addSomeNote = async (note) => {
    dispatch(addNewNote(note));
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newNote = {
      title: inputs.title,
      content: inputs.content,
      category: inputs.category,
      subject: inputs.subject,
    }
    await addSomeNote(newNote);
  }

  const handleClose = () => {
    setModalClass("App");
  } 

  const setSubject = (e, subject) => {
    setInputs((prev) => {
      return {
        ...prev,
        subject,
      }
    });
    setSubjectMenu(!subjectMenu);
  }

  const setCategory = (e, category) => {
    setInputs((prev) => {
      return {
        ...prev,
        category,
      }
    });
    setCategoryMenu(!categoryMenuShown);
  }

  return (
    <motion.div 
      variants={dropIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className='note-form-container'
    >
      <button onClick={handleClose} className="close_modal_btn">
        <CloseIcon/>
      </button>
      <form className="note-form" onSubmit={handleFormSubmit}>
        <div className="note-form-item">
          <label>Title</label>
          <input 
            type="text"
            value={inputs.title}
            name="title"
            onChange={handleInputChange}
          />
        </div>
        <div className='dropdown-form-menu'>
          <label>Category</label>
          <div onClick={() => setCategoryMenu(!categoryMenuShown)} className='top-category-dropdown'>
            <span>{inputs.category === "" ? 'Select a category' : inputs.category}</span>
            {!categoryMenuShown ? <ArrowDropDownIcon/> : <KeyboardArrowUpIcon/>}
          </div>
          {categoryMenuShown &&
            <ul className='list-of-categories'>
              {new Array("School", "Interests", "Entertainment", "Life").map((it, i) => {
                return (
                  <li onClick={(e) => setCategory(e, it)} key={i}>
                    {it}
                  </li>
              )})}
            </ul>
          }
        </div>
        <div className='dropdown-form-menu'>
          <label>Subject</label>
          <div onClick={() => setSubjectMenu(!subjectMenu)} className='top-category-dropdown'>
            <span>{inputs.subject === "" ? 'Select a category' : inputs.subject}</span>
            {!subjectMenu ? <ArrowDropDownIcon/> : <KeyboardArrowUpIcon/>}
          </div>
          {subjectMenu &&
            <ul className='list-of-categories'>
              {new Array("Programming", "Discrete Math", "Algebra", "Math analysis").map((it, i) => {
                return (
                  <li onClick={(e) => setSubject(e, it)} key={i}>
                    {it}
                  </li>
              )})}
            </ul>
          }
        </div>
        <div className="note-form-item">
          <label>Content</label>
          <textarea
            type="text"
            value={inputs.content}
            name="content"
            onChange={handleInputChange}
          />
        </div>
        <button onClick={handleFormSubmit} className="add-note-btn">
          Add Note
        </button>
      </form>
    </motion.div>
  )
}


export default NewNoteForm;
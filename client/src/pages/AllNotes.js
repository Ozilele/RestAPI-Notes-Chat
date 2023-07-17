import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Note from '../components/Note/Note';
import './AllNotes.css';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from '../svg/notes_spinner.svg';
import Cookies from 'js-cookie';
import { fetchNotes, fetchSomeNotes, selectNotes, selectState } from '../state_slices/noteSlice';
import { useLocation } from 'react-router-dom';

const AllNotes = () => {

  const location = useLocation();
  const dispatch = useDispatch();
  const isSpinnerShown = useSelector(selectState);
  const notesData = useSelector(selectNotes);

  useEffect(() => {
    const { accessToken } = Cookies.get();
    if(location.search !== "") {
      dispatch(fetchSomeNotes(location.search));
    } else {
      dispatch(fetchNotes(accessToken));
    }
  }, [dispatch]);

  return (
    <div className='all-notes'>
      {isSpinnerShown === "loading" && 
        <div className='spinner-div'>
          <img className='spinner-img' src={Spinner} alt="Spinner"/> 
        </div>
      }
      <AnimatePresence
        initial={false}
      >
        {notesData.length > 0 && notesData.map(newNote => {
          return (
            <Note 
              key={newNote._id}
              id={newNote._id}
              title={newNote.title}
              date={newNote.date.toString()}
              content={newNote.content}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default AllNotes;
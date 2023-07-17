import React, { useState } from 'react'
import './SearchField.css';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchNotesFromTitleName, fetchSomeNotes, resetNotes } from '../../state_slices/noteSlice';
import { useSearchParams } from 'react-router-dom';

const SearchField = ({ box, setOpen }) => {

  const [inputs, setInputs] = useState({
    title: '',
  });
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const showFilterBox = (e) => {
    setOpen(!box);
  }

  const handleInput = (e) => {
    e.preventDefault();
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    });
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if(inputs.title.trim().length > 0) {
      setSearchParams(inputs);
    } else {
      setSearchParams({})
    }
    dispatch(resetNotes());
    dispatch(fetchNotesFromTitleName(inputs.title));
  }

  return (
    <div className="input-search-field">
      <form onSubmit={handleSubmitForm} className="input-field">
        <IconButton>
          <SearchIcon className='search-icon'/>
        </IconButton>
        <input name='title' value={inputs.title} onChange={handleInput} className='notes-input' type='text' placeholder='Szukaj'/>
        <IconButton onClick={showFilterBox} className="apply-filters-btn">
          <TuneOutlinedIcon/>
        </IconButton>
      </form>
    </div>
  )
}

export default SearchField
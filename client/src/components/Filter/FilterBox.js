import React, { useState } from 'react'
import './FilterBox.css';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchSomeNotes } from '../../state_slices/noteSlice';

const subjects = [
  "Programming",
  "Discrete Math",
  "Algebra",
  "Math analysis",
]

const categories = [
  "School",
  "Interests",
  "Entertainment",
  "Life"
]

const FilterBox = () => {

  const [activeCategoryFilters, setActiveCategoryFilters] = useState([]);
  const [activeSubjectFilters, setActiveSubjectFilters] = useState([]); 
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const applyFilters = (e) => {
    const allAppliedFilters = activeCategoryFilters.concat(activeSubjectFilters);
    const filterObj = {};
    if(categories.includes(allAppliedFilters[0])) {
      filterObj.category = allAppliedFilters[0];
    } else if(subjects.includes(allAppliedFilters[0])) {
      filterObj.subject = allAppliedFilters[0];
    }
    if(allAppliedFilters[1]) {
      filterObj.subject = allAppliedFilters[1];
    }
    setSearchParams(filterObj);

    dispatch(fetchSomeNotes(filterObj));
  }

  const changeSubjectFilters = (subject) => {
    if(activeSubjectFilters.includes(subject)) {
      setActiveSubjectFilters([]);
    } else {
      setActiveSubjectFilters((prevFilters) => {
        return [
          subject
        ]
      });
    }
  }

  const changeCategoryFilters = (category) => {
    if(activeCategoryFilters.includes(category)) {
      setActiveCategoryFilters([]);
    } else {
      setActiveCategoryFilters((prevFilters) => {
        return [
          category,
        ]
      });
    }
  }

  const clearFilters = () => {
    setActiveCategoryFilters([])
    setActiveSubjectFilters([])
  }

  return (
    <div className="filter-box">
      <div className="categories-list">
        <h3>Categories</h3>
        <div className='categories-box'>
          {categories.map(category => {
            const isActive = activeCategoryFilters.includes(category);
            const activeBtnStyle = isActive ? { backgroundColor: '#9681EB', borderBottom: '1px solid transparent' } : {};
            return <button 
              style={activeBtnStyle}
              key={category}
              onClick={() => changeCategoryFilters(category)}>
              {category}
            </button>
          })}
        </div>
      </div>
      <div className="subjects-list">
        <h3>Subjects</h3>
        <div className='categories-box'>
          {subjects.map(subject => {
            const isActive = activeSubjectFilters.includes(subject);
            const activeSubjectBtnStyle = isActive ? { backgroundColor: '#9681EB', borderBottom: '1px solid transparent' } : {};
            return <button 
              key={subject}
              style={activeSubjectBtnStyle}
              onClick={() => changeSubjectFilters(subject)}>
                {subject}
              </button>
          })};
        </div>
      </div>
      <div className='filter-box-btns'>
        <button onClick={() => clearFilters()} className='clear-btn'>Clear Filters</button>
        <button onClick={applyFilters} className="apply-btn">Apply</button>
      </div>
    </div>
  )
}

export default FilterBox
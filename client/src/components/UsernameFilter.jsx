import React, { useEffect, useState } from 'react';
import '../styles/RidesFilter.css'

import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useAuth from "../hooks/useAuth"


const UsernameFilter = ({ handleShowFilter, onFilter }) => {

  const [userName, setUsername] = useState("all")


  const { auth } = useAuth()

  const handleFilter = () => {
    // Prepare filter criteria
    const filters = {};


    if (userName !== '') {
      filters.userName = userName
    }

    // Pass filters to parent component
    onFilter(filters);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.trim() !== '' ? (e.target.value) : 'all';
    setUsername(value);
  };

  useEffect(() => {
    // This useEffect will trigger after states modified by clearFilter are updated
    handleFilter();
  }, [userName]); // Dependency array includes modified states


  const clearFilter = () => {
    setUsername('all');

  };

  return (
    <div className='filter-container'>

      <div className='filter-range'>
        <button
          className='red-button  hide-big'
          onClick={() => handleShowFilter()}>x</button>
        <button title="Clear filter" className='orange-button' onClick={() => { clearFilter(); handleFilter(); }}><FontAwesomeIcon icon={faUndo}></FontAwesomeIcon></button>
        <button
          className='red-button  hide-small'
          onClick={() => handleShowFilter()}>x</button>
      </div>

      <div className='filter-range'>
        <label className='filter-label'>Name:</label>
        <input
          className='filter-input'
          type="text"
          value={userName === '' || userName === "all" ? '' : userName}
          onChange={handleNameChange}
          placeholder='Aa'
        />
      </div>

    </div>
  );
};

export default UsernameFilter;

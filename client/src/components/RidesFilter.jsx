import React, { useEffect, useState } from 'react';
import '../styles/RidesFilter.css'

import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useAuth from "../hooks/useAuth"


const RideFilter = ({ rides, onFilter, handleShowFilter }) => {


  const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState("9999-12-31");
  const [distanceMin, setDistanceMin] = useState(0);
  const [distanceMax, setDistanceMax] = useState(100000);
  const [speedMin, setSpeedMin] = useState(0);
  const [speedMax, setSpeedMax] = useState(100000);
  const [rideName, setRideName] = useState("all")
  const [rId, setRId] = useState(0)

  const { auth } = useAuth()

  const handleFilter = () => {
    // Prepare filter criteria
    const filters = {};

    if (dateStart !== '') {
      filters.dateStart = new Date(dateStart)

    };

    if (dateEnd !== '') {
      filters.dateEnd = new Date(dateEnd)
    }

    if (distanceMin !== '') {
      filters.distanceMin = parseFloat(distanceMin)
    }

    if (distanceMax !== '') {
      filters.distanceMax = parseFloat(distanceMax)
    };


    if (speedMin !== '') {
      filters.speedMin = parseFloat(speedMin)
    }

    if (speedMax !== '') {
      filters.speedMax = parseFloat(speedMax)
    }

    if (rideName !== '') {
      filters.rideName = rideName
    }

    if (rId !== '') {
      filters.rId = rId
    }

    // Pass filters to parent component
    onFilter(filters);
  };

  const handleDateStartChange = (e) => {
    const value = e.target.value.trim() !== '' ? e.target.value : new Date().toISOString().split('T')[0];
    setDateStart(value);
  };

  const handleDateEndChange = (e) => {
    const value = e.target.value.trim() !== '' ? e.target.value : '9999-12-31';
    setDateEnd(value);
  };

  const handleDistanceMinChange = (e) => {
    const value = e.target.value.trim() !== '' ? parseFloat(e.target.value) : 0;
    setDistanceMin(value);
  };

  const handleDistanceMaxChange = (e) => {
    const value = e.target.value.trim() !== '' ? parseFloat(e.target.value) : 100000;
    setDistanceMax(value);
  };

  const handleSpeedMinChange = (e) => {
    const value = e.target.value.trim() !== '' ? parseFloat(e.target.value) : 0;
    setSpeedMin(value);
  };

  const handleSpeedMaxChange = (e) => {
    const value = e.target.value.trim() !== '' ? parseFloat(e.target.value) : 100000;
    setSpeedMax(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.trim() !== '' ? (e.target.value) : 'all';
    setRideName(value);
  };

  const handleRIdChange = (e) => {
    const value = e.target.value.trim() !== '' ? (e.target.value) : 0;
    setRId(value);
  };


  useEffect(() => {
    // This useEffect will trigger after states modified by clearFilter are updated
    handleFilter();
  }, [dateStart, dateEnd, distanceMin, distanceMax, speedMin, speedMax, rideName, rId]); // Dependency array includes modified states


  const clearFilter = () => {
    setDateStart(new Date().toISOString().split('T')[0]);
    setDateEnd('9999-12-31');
    setDistanceMin(0);
    setDistanceMax(100000);
    setSpeedMin(0);
    setSpeedMax(100000);
    setRideName('all');
    setRId(0);
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
        <label className='filter-label'>Dates:</label>
        <input
          className='filter-input'
          type="date"
          value={dateStart}
          onChange={handleDateStartChange}

        />
        <input
          className='filter-input'
          type="date"
          value={dateEnd === "9999-12-31" ? "" : dateEnd}
          onChange={handleDateEndChange}
        />

      </div>
      <div className='filter-range'>
        <label className='filter-label'>Distance:</label>
        <input
          className='filter-input'
          type="number"
          value={distanceMin === 0 ? "" : distanceMin}
          onChange={handleDistanceMinChange}
          placeholder='Min (Km)'
        />
        {/* <span className='filter-span'>km -</span> */}
        <input
          className='filter-input'
          type="number"
          value={distanceMax === 100000 ? "" : distanceMax}
          onChange={handleDistanceMaxChange}
          placeholder='Max (Km)'
        />
        {/* <span className='filter-span'>km</span> */}
      </div>
      <div className='filter-range'>
        <label className='filter-label'>Speed:</label>
        <input
          className='filter-input'
          type="number"
          value={speedMin === 0 ? "" : speedMin}
          onChange={handleSpeedMinChange}
          placeholder='Min (Km/h)'
        />
        {/* <span className='filter-span'>km/h -</span> */}
        <input
          className='filter-input'
          type="number"
          value={speedMax === 100000 ? "" : speedMax}
          onChange={handleSpeedMaxChange}
          placeholder='Max (Km/h)'
        />
        {/* <span className='filter-span'>km/h</span> */}
      </div>

      <div className='filter-range'>
        <label className='filter-label'>Name:</label>
        <input
          className='filter-input'
          type="text"
          value={rideName === '' || rideName === "all" ? '' : rideName}
          onChange={handleNameChange}
          placeholder='Aa'
        />

      </div>


{auth.isAdmin && 
      <div className='filter-range'>
      <label className='filter-label'>Id:</label>
      <input
        className='filter-input'
        type="number"
        value={rId === 0 ? "" : rId}
        onChange={handleRIdChange}
        placeholder='Number'
      />

    </div>

}





      {/* <button onClick={handleFilter}>Apply Filters</button> */}

    </div>
  );
};

export default RideFilter;

import React, { useEffect, useState } from 'react';
import '../styles/RidesFilter.css'

import { faUndo} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




const RunFilter = ({ runs, onFilter, handleShowFilter }) => {


  const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState("9999-12-31");
  const [distanceMin, setDistanceMin] = useState(0);
  const [distanceMax, setDistanceMax] = useState(100000);
  const [speedMin, setSpeedMin] = useState(0);
  const [speedMax, setSpeedMax] = useState(100000);

  // console.log (dateStart, dateEnd, distanceMin, distanceMax, speedMin, speedMax)

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

  const handlePaceMinChange = (e) => {
    const value = e.target.value.trim() !== '' ? parseFloat(e.target.value) : 0;
    setSpeedMin(value);
  };

  const handlePaceMaxChange = (e) => {
    const value = e.target.value.trim() !== '' ? parseFloat(e.target.value) : 100000;
    setSpeedMax(value);
  };

  useEffect(() => {
    // This useEffect will trigger after states modified by clearFilter are updated
    handleFilter();
  }, [dateStart, dateEnd, distanceMin, distanceMax, speedMin, speedMax]); // Dependency array includes modified states


  const clearFilter = () => {
    setDateStart(new Date().toISOString().split('T')[0]);
    setDateEnd('9999-12-31');
    setDistanceMin(0);
    setDistanceMax(100000);
    setSpeedMin(0);
    setSpeedMax(100000);
  };

  return (
    <div className='filter-container'>

            <div className='filter-range'>
            <button
      className='red-button hide-big'
      onClick={() => handleShowFilter()}>x</button>
      {/* <button onClick={handleFilter}>Apply Filters</button> */}
      <button title="Clear filter" className='orange-button' onClick={() => {clearFilter(); handleFilter();}}><FontAwesomeIcon icon={faUndo}></FontAwesomeIcon></button>
      <button
      className='red-button hide-small'
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
        {/* <span>km -</span> */}
        <input
          className='filter-input'
          type="number"
          value={distanceMax === 100000 ? "" : distanceMax}
          onChange={handleDistanceMaxChange}
          placeholder='Max (Km)'
        />
        {/* <span>km</span> */}
      </div>
      <div className='filter-range'>
        <label className='filter-label'>Pace:</label>
        <input
          className='filter-input'
          type="number"
          value={speedMin === 0 ? "" : speedMin}
          onChange={handlePaceMinChange}
          placeholder='Min (min/km)'
        />
        {/* <span>min/km -</span> */}
        <input
          className='filter-input'
          type="number"
          value={speedMax === 100000 ? "" : speedMax}
          onChange={handlePaceMaxChange}
          placeholder='Max (min/km)'
        />
        {/* <span>min/km</span> */}
      </div>

    </div>
  );
};

export default RunFilter;

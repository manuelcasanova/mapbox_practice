import React, { useEffect, useState } from 'react';
import '../styles/RidesFilter.css'

const RunFilter = ({ runs, onFilter, handleShowFilter }) => {


  const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState("9999-12-31");
  const [distanceMin, setDistanceMin] = useState(0);
  const [distanceMax, setDistanceMax] = useState(100000);
  const [paceMin, setPaceMin] = useState(0);
  const [paceMax, setPaceMax] = useState(100000);

  // console.log (dateStart, dateEnd, distanceMin, distanceMax, paceMin, paceMax)

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


    if (paceMin !== '') {
      filters.paceMin = parseFloat(paceMin)
    }

    if (paceMax !== '') {
      filters.paceMax = parseFloat(paceMax)
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
    setPaceMin(value);
  };

  const handlePaceMaxChange = (e) => {
    const value = e.target.value.trim() !== '' ? parseFloat(e.target.value) : 100000;
    setPaceMax(value);
  };

  useEffect(() => {
    // This useEffect will trigger after states modified by clearFilter are updated
    handleFilter();
  }, [dateStart, dateEnd, distanceMin, distanceMax, paceMin, paceMax]); // Dependency array includes modified states


  const clearFilter = () => {
    setDateStart(new Date().toISOString().split('T')[0]);
    setDateEnd('9999-12-31');
    setDistanceMin(0);
    setDistanceMax(100000);
    setPaceMin(0);
    setPaceMax(100000);
  };

  return (
    <div className='filter-container'>
            <button
      className='filter-button-close hide-big'
      onClick={() => handleShowFilter()}>x</button>
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
          value={paceMin === 0 ? "" : paceMin}
          onChange={handlePaceMinChange}
          placeholder='Min (min/km)'
        />
        {/* <span>min/km -</span> */}
        <input
          className='filter-input'
          type="number"
          value={paceMax === 100000 ? "" : paceMax}
          onChange={handlePaceMaxChange}
          placeholder='Max (min/km)'
        />
        {/* <span>min/km</span> */}
      </div>
      <div className='filter-range'>
      {/* <button onClick={handleFilter}>Apply Filters</button> */}
      <button className='filter-button' onClick={() => {clearFilter(); handleFilter();}}>Clear</button>
      <button
      className='filter-button-close hide-small'
      onClick={() => handleShowFilter()}>x</button>
    </div>
    </div>
  );
};

export default RunFilter;

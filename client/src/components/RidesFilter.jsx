import React, { useEffect, useState } from 'react';

const RideFilter = ({ rides, onFilter }) => {


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

  const handleSpeedMinChange = (e) => {
    const value = e.target.value.trim() !== '' ? parseFloat(e.target.value) : 0;
    setSpeedMin(value);
  };

  const handleSpeedMaxChange = (e) => {
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
    <div>
      <h2>Filter Rides</h2>
      <div>
        <label>Date Range:</label>
        <input
          type="date"
          value={dateStart}
          onChange={handleDateStartChange}

        />
        <input
          type="date"
          value={dateEnd === "9999-12-31" ? "" : dateEnd}
          onChange={handleDateEndChange}
        />

      </div>
      <div>
        <label>Distance Range:</label>
        <input
          type="number"
          value={distanceMin === 0 ? "" : distanceMin}
          onChange={handleDistanceMinChange}
        />
        <span>km -</span>
        <input
          type="number"
          value={distanceMax === 100000 ? "" : distanceMax}
          onChange={handleDistanceMaxChange}
        />
        <span>km</span>
      </div>
      <div>
        <label>Speed Range:</label>
        <input
          type="number"
          value={speedMin === 0 ? "" : speedMin}
          onChange={handleSpeedMinChange}
        />
        <span>km/h -</span>
        <input
          type="number"
          value={speedMax === 100000 ? "" : speedMax}
          onChange={handleSpeedMaxChange}
        />
        <span>km/h</span>
      </div>
      {/* <button onClick={handleFilter}>Apply Filters</button> */}
      <button onClick={() => {clearFilter(); handleFilter();}}>Clear Filters</button>
    </div>
  );
};

export default RideFilter;

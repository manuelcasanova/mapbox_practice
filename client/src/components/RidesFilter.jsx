import React, { useEffect, useState } from 'react';

const RideFilter = ({ rides, onFilter }) => {


  const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState("9999-12-31");
  const [distanceMin, setDistanceMin] = useState(0);
  const [distanceMax, setDistanceMax] = useState(100000);
  const [speedMin, setSpeedMin] = useState(0);
  const [speedMax, setSpeedMax] = useState(100000);



  const handleFilter = () => {
    // Prepare filter criteria
    const filters = {};

    if (dateStart) {
      filters.dateStart = new Date(dateStart)

    };

    if (dateEnd) {
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


  return (
    <div>
      <h2>Filter Rides</h2>
      <div>
        <label>Date Range:</label>
        <input
          type="date"
          value={dateStart}
          onChange={(e) => setDateStart(e.target.value)}

        />
        <input
          type="date"
          value={dateEnd}
          onChange={(e) => setDateEnd(e.target.value)}
        />

      </div>
      <div>
        <label>Distance Range:</label>
        <input
          type="number"
          value={distanceMin}
          onChange={(e) => setDistanceMin(e.target.value)}
        />
        <span>km -</span>
        <input
          type="number"
          value={distanceMax}
          onChange={(e) => setDistanceMax(e.target.value)}
        />
        <span>km</span>
      </div>
      <div>
        <label>Speed Range:</label>
        <input
          type="number"
          value={speedMin}
          onChange={(e) => setSpeedMin(e.target.value)}
        />
        <span>km/h -</span>
        <input
          type="number"
          value={speedMax}
          onChange={(e) => setSpeedMax(e.target.value)}
        />
        <span>km/h</span>
      </div>
      <button onClick={handleFilter}>Apply Filters</button>
    </div>
  );
};

export default RideFilter;

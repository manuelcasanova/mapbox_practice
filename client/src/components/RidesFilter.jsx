import React, { useState } from 'react';

const RidesFilter = ({ rides, onFilter }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [distanceRange, setDistanceRange] = useState({ min: '', max: '' });
  const [speedRange, setSpeedRange] = useState({ min: '', max: '' });

  const handleFilter = () => {
    // Prepare filter criteria
    const filters = {};
    if (dateRange.start && dateRange.end) {
      filters.dateRange = {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end),
      };
    }
    if (distanceRange.min && distanceRange.max) {
      filters.distanceRange = {
        min: parseFloat(distanceRange.min),
        max: parseFloat(distanceRange.max),
      };
    }
    if (speedRange.min && speedRange.max) {
      filters.speedRange = {
        min: parseFloat(speedRange.min),
        max: parseFloat(speedRange.max),
      };
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
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </div>
      <div>
        <label>Distance Range:</label>
        <input
          type="number"
          value={distanceRange.min}
          onChange={(e) => setDistanceRange({ ...distanceRange, min: e.target.value })}
        />
        <span>km -</span>
        <input
          type="number"
          value={distanceRange.max}
          onChange={(e) => setDistanceRange({ ...distanceRange, max: e.target.value })}
        />
        <span>km</span>
      </div>
      <div>
        <label>Speed Range:</label>
        <input
          type="number"
          value={speedRange.min}
          onChange={(e) => setSpeedRange({ ...speedRange, min: e.target.value })}
        />
        <span>km/h -</span>
        <input
          type="number"
          value={speedRange.max}
          onChange={(e) => setSpeedRange({ ...speedRange, max: e.target.value })}
        />
        <span>km/h</span>
      </div>
      <button onClick={handleFilter}>Apply Filters</button>
    </div>
  );
};

export default RidesFilter;

import React, { useEffect, useState } from 'react';
import '../styles/RidesFilter.css'

import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useAuth from "../hooks/useAuth"

import { useCoords } from './util_functions/GetBrowserLocation';

const RideFilter = ({ onFilter, handleShowFilter, ridesAllComponentMount }) => {


  const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState("9999-12-31");
  const [distanceMin, setDistanceMin] = useState(0);
  const [distanceMax, setDistanceMax] = useState(100000);
  const [speedMin, setSpeedMin] = useState(0);
  const [speedMax, setSpeedMax] = useState(100000);
  const [rideName, setRideName] = useState("all")
  const [radius, setRadius] = useState(6371)
  const [rId, setRId] = useState(0)
  const {browCoords} = useCoords()

  const { auth } = useAuth()

  const handleFilter = () => {

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

    if (radius !== '') {
      filters.radius = radius
    }

    if (rId !== '') {
      filters.rId = rId
    }

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

  const handleRadiusChange = (e) => {
    const value = e.target.value.trim() !== '' ? (e.target.value) : '';
    setRadius(value);
  };

  const handleRIdChange = (e) => {
    const value = e.target.value.trim() !== '' ? (e.target.value) : 0;
    setRId(value);
  };


  useEffect(() => {
    handleFilter();
  }, [dateStart, dateEnd, distanceMin, distanceMax, speedMin, speedMax, rideName, radius, rId]);


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
        <input
          className='filter-input'
          type="number"
          value={distanceMax === 100000 ? "" : distanceMax}
          onChange={handleDistanceMaxChange}
          placeholder='Max (Km)'
        />
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
        <input
          className='filter-input'
          type="number"
          value={speedMax === 100000 ? "" : speedMax}
          onChange={handleSpeedMaxChange}
          placeholder='Max (Km/h)'
        />
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

      <div className='filter-range'>
        <label className='filter-label'>Radius for start point:</label>
        <input
          className='filter-input'
          type="text"
          value={radius}
          onChange={handleRadiusChange}
          placeholder='6371'
          disabled={browCoords.length === 0} 
        />
           <label className='filter-label'>Km</label>

      </div>

      {browCoords.length === 0 && <div className='info-message-2'>Allow this app to access your location and refresh the page to enable "Radius for start point"</div>}


      {auth.isAdmin && ridesAllComponentMount &&
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


    </div>
  );
};

export default RideFilter;

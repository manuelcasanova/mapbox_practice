import React, { useState, useEffect } from 'react';

const TimePickerComponent = ({ time, setTime }) => {
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const seconds = '00';

  useEffect(() => {
    // Check if hours and minutes are null (indicating no user interaction)
    if (hours === null || minutes === null) {
      // Set default values for hours and minutes
      setHours(12);
      setMinutes("00");
      // Update time with default values
      updateTime(12, 0);
    }
  }, [hours, minutes]); // Run this effect whenever hours or minutes change

  const handleHoursChange = (event) => {
    let newHours = parseInt(event.target.value);
    if (newHours < 0 || newHours > 23 || isNaN(newHours)) {
      newHours = ""; // Reset to 0 if input is invalid
    }
    setHours(newHours);
    updateTime(newHours, minutes);
  };

  const handleMinutesChange = (event) => {
    let newMinutes = parseInt(event.target.value);
    if (newMinutes < 0 || newMinutes > 59 || isNaN(newMinutes)) {
      newMinutes = ""; // Reset to 0 if input is invalid
    }
    setMinutes(newMinutes);
    updateTime(hours, newMinutes);
  };

  const updateTime = (newHours, newMinutes) => {
    const newTime = `${newHours < 10 ? '0' + newHours : newHours}:${newMinutes < 10 ? '0' + newMinutes : newMinutes}:${seconds}`;
    setTime(newTime);
  };

  return (
    <div className="time-picker">
      <div>
        <input 
          type="number" 
          min="0" 
          max="23" 
          value={hours !== null ? hours : ''} 
          onChange={handleHoursChange} 
        />
      </div>
      <div>
        <label>:</label>
        <input 
          type="number" 
          min="0" 
          max="59" 
          value={minutes !== null ? minutes : ''} 
          onChange={handleMinutesChange} 
        />
      </div>
    </div>
  );
};

export default TimePickerComponent;

import React, { useState } from 'react';

const TimePickerComponent = ({ time, setTime }) => {
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');

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
    const newTime = `${newHours < 10 ? '0' + newHours : newHours}:${newMinutes < 10 ? '0' + newMinutes : newMinutes}`;
    setTime(newTime);
  };

  return (
    <div className="time-picker">
      <div>
        {/* <label>Hours:</label> */}
        <input 
          type="number" 
          min="0" 
          max="23" 
          value={hours} 
          onChange={handleHoursChange} 
        />
      </div>
      <div>
        <label>:</label>
        <input 
          type="number" 
          min="0" 
          max="59" 
          value={minutes} 
          onChange={handleMinutesChange} 
        />
      </div>
    </div>
  );
};

export default TimePickerComponent;

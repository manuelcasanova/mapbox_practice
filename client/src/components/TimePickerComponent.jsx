import React from 'react';
import TimePicker from 'react-time-picker';

export default function TimePickerComponent({ time, setTime }) {
  return (
    <div>
      <TimePicker
        onChange={setTime}
        value={time}
        className='react-time-picker'
      />
    </div>
  );
}

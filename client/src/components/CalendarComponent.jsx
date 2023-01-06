import Calendar from 'react-calendar';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

export default function CalendarComponent ({date, setDate}) {


// console.log("date", date)

const dateString = date.toLocaleDateString("en-GB")
// console.log("dateString", dateString)


// setDate(dateString)
// console.log("date", date)



  return (
    <>
    <div>
      <Calendar 
      onChange={setDate} 
      value={date} 
      className='react-calendar'/>
      
    </div>
    {/* <div>Selected date {dateString}</div> */}
    </>
  )
}

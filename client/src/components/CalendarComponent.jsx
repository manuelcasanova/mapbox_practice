import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarComponent ({date, setDate}) {

// const dateString = date.toLocaleDateString("en-GB")

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

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarComponent ({date, setDate}) {

  return (
    <>
    <div>
      <Calendar 
      onChange={setDate} 
      value={date} 
      className='react-calendar'/>
    </div>
    </>
  )
}

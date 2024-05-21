import '../../src/styles/Footer.css'

export default function Footer ({rideApp}) {
  // console.log(rideApp)
  return (
    <div className='footer'>
      {rideApp ? <div>RIDE WITH ME</div> : <div>RUN WITH ME</div>}
    </div>
  )
}
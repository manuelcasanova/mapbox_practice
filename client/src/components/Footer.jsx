import '../../src/styles/Footer.css'

export default function Footer ({rideApp}) {
  // console.log(rideApp)
  return (
    <div className='footer'>
      {rideApp ? <div className='footer-text'>RIDE WITH ME</div> : <div className='footer-text'>RUN WITH ME</div>}
    </div>
  )
}
#Click on map and get coordinates

  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)

  function MyComponent() {
    const map = useMapEvents({
      click: () => {
        map.locate()
      },
      locationfound: (location) => {
        setLatitude(location.latitude)
        setLongitude(location.longitude)
        console.log("You clicked on the map")
      },
    })
    return null
  }

   <MyComponent />
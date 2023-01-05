export default function Now() {

  const timestamp = Date.now();
  // console.log("date now", timestamp)
  
  const dateCreatedAt = new Date(timestamp).toLocaleDateString("en-GB")
  // console.log("dateCreatedAt", dateCreatedAt)
  
  const timeCreatedAt = new Date(timestamp).toLocaleTimeString("en-GB")
  //console.log(timeCreatedAt)
  
  const createdAt = dateCreatedAt + ` ${timeCreatedAt}`
  //console.log("createdAt", createdAt)
  return (

    createdAt
  )
}
const pool = require('../config/db');

const handleLogout = async (req, res) => {
  //On front end, also delete the accessToken

// console.log("req logoutController", req.cookies)
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204); //Successful. No content to send back
  const refreshToken = cookies.jwt;

  //See if refresh token is in db
  try {
    const data = await pool.query('SELECT * FROM users WHERE refreshtoken = $1', [refreshToken])
    const foundUser = data.rows;
    //  console.log("foundUser", foundUser)
  if (foundUser.length === 0) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    console.log(2)
    return res.sendStatus(204);
  } else {

 
//If we reach this point, we found the same refresh token in db
  //Delete the refresh token in db

  foundUser[0].refreshtoken = '';
//  console.log("foundUser", foundUser[0])
   pool.query('UPDATE users SET refreshtoken=$1 WHERE id=$2', [foundUser[0].refreshtoken, foundUser[0].id])


  //console.log(result); //Delete before production
  
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true}); //secure: true - only serves on https. We would add this on production
    res.sendStatus(204);


  }
  } catch (error) {

    console.log(error)
  }

  
}

module.exports = { handleLogout }

//NEXT VERSION, CLONED FROM DAVE'S REPO KEEPS GIVING ME ERRORS. SO I TOOK A DIFFERENT VERSION.

// const User = require('../model/User');

// const handleLogout = async (req, res) => {
//     // On client, also delete the accessToken

//     const cookies = req.cookies;
//     if (!cookies?.jwt) return res.sendStatus(204); //No content
//     const refreshToken = cookies.jwt;

//     // Is refreshToken in db?
//     const foundUser = await User.findOne({ refreshToken }).exec();
//     if (!foundUser) {
//         res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
//         return res.sendStatus(204);
//     }

//     // Delete refreshToken in db
//     foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
//     const result = await foundUser.save();
//     console.log(result);

//     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
//     res.sendStatus(204);
// }

// module.exports = { handleLogout }
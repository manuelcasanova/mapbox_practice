const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { pwd, trimmedEmail } = req.body;
  // console.log(req.body)
  if (!pwd || !trimmedEmail) return res.status(400).json({ 'message': 'Email and password are required.' });

  //See if the email exists MONGODB
  //const foundEmail = await User.findOne({ email: email }).exec();
  // if (!foundEmail) return res.sendStatus(401); //401 Unauthorized

  try {
    const data = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail])
    const foundEmail = data.rows;
    // console.log("foundemail on authCOntroller", foundEmail)
    if (foundEmail.length === 0) {
      res.status(400).json({
        error: "No user registered"
      })
    } else {
      bcrypt.compare(pwd, foundEmail[0].password, (err, result) => {
        if (err) {
          res.status(500).json({
            error: "Server error"
          });
        } else if (result === true) {




          const id = foundEmail[0].id;
          const username = foundEmail[0].username;
          const isAdmin = foundEmail[0].isadmin;
          const isSuperAdmin = foundEmail[0].issuperadmin;
          const email = foundEmail[0].email;
          const isActive = foundEmail[0].isactive;
          let loggedIn; 

          if (id !== null) {
            loggedIn = true; 
          } else {
            loggedIn = false;
          }

          // const roles = Object.values(foundEmail[0].roles).filter(Boolean);
          //Create JWTs Token. To send to use with the other routes that we want protected in our API.
          const accessToken = jwt.sign(
            {
              "UserInfo": {
                "email": foundEmail[0].email
                // ,
                // "roles": roles
              }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20m' } //In production, a few minutes.
          );
          const refreshToken = jwt.sign(
            { "username": foundEmail[0].username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1h' }
          );
          //Save refreshToken with current user

          foundEmail[0].refreshToken = refreshToken;

          pool.query('UPDATE users SET refreshtoken=$1 WHERE email=$2', [refreshToken, trimmedEmail])
          // console.log(result) //Delete before production

          //http cookie not accesible by js (for security. More secure than localstorage or another cookie)
          //remove secure: true temporarily if want to test with tunder client. Back in for production
          res.cookie('jwt', refreshToken, {
            httpOnly: true, sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
          })
          res.json({
            id, loggedIn,
            username, isAdmin, isSuperAdmin, isActive, email,
            // roles, 
            accessToken
          });
          // res.json({'success': `user ${user} is logged in`});



        } else {
          if (result !== true) res.status(401).json({ error: "Enter correct password" });
        }
      })
    }


  } catch (error) {
    console.log(error)
  };

};



module.exports = { handleLogin };

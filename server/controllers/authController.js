const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { pwd, trimmedEmail } = req.body;

  if (!pwd || !trimmedEmail) return res.status(400).json({ 'message': 'Email and password are required.' });

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "No user registered" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(pwd, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const { id, username, isadmin, issuperadmin, email, isactive } = user;
    const loggedIn = !!id;

    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });

    // Save refreshToken with current user
    await pool.query('UPDATE users SET refreshtoken = $1 WHERE email = $2', [refreshToken, trimmedEmail]);

    // Insert login history
    await pool.query('INSERT INTO login_history (user_id, login_time) VALUES ($1, $2)', [id, new Date()]);

    // Set HttpOnly cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    // Send response
    res.json({
      id,
      loggedIn,
      username,
      isAdmin: isadmin,
      isSuperAdmin: issuperadmin,
      isActive: isactive,
      email,
      accessToken
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { handleLogin };


// const bcrypt = require('bcrypt');
// const pool = require('../config/db');
// const jwt = require('jsonwebtoken');

// const handleLogin = async (req, res) => {
//   // console.log("hits handleLogin in authController")
//   const { pwd, trimmedEmail } = req.body;


//   const now = new Date();
//   // const localTime = new Date(now.getTime() - (7 * 3600000));

//   // console.log("Now", now)
//   // console.log("localTime", localTime)


//   //  console.log(req.body)
//   if (!pwd || !trimmedEmail) return res.status(400).json({ 'message': 'Email and password are required.' });

//   try {
//     const data = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail])
//     const foundEmail = data.rows;
//     //  console.log("foundemail on authCOntroller", foundEmail)
//     if (foundEmail.length === 0) {
//       res.status(400).json({
//         error: "No user registered"
//       })
//     } else {
//       bcrypt.compare(pwd, foundEmail[0].password, (err, result) => {
//         if (err) {
//           res.status(500).json({
//             error: "Server error"
//           });
//         } else if (result === true) {




//           const id = foundEmail[0].id;
//           const username = foundEmail[0].username;
//           const isAdmin = foundEmail[0].isadmin;
//           const isSuperAdmin = foundEmail[0].issuperadmin;
//           const email = foundEmail[0].email;
//           const isActive = foundEmail[0].isactive;
//           let loggedIn; 


//           if (id !== null) {
//             loggedIn = true; 
//           } else {
//             loggedIn = false;
//           }
//           // const roles = Object.values(foundEmail[0].roles).filter(Boolean);
//           //Create JWTs Token. To send to use with the other routes that we want protected in our API.
//           const accessToken = jwt.sign(
//             {
//               "UserInfo": {
//                 "email": foundEmail[0].email
//                 // ,
//                 // "roles": roles
//               }
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: '20m' } //In production, a few minutes.
//           );
//           const refreshToken = jwt.sign(
//             { "username": foundEmail[0].username },
//             process.env.REFRESH_TOKEN_SECRET,
//             { expiresIn: '1h' }
//           );
//           //Save refreshToken with current user

//           foundEmail[0].refreshtoken = refreshToken;

//           pool.query(
//             `
//             INSERT INTO login_history (user_id, login_time)
//             VALUES ($1, $2)
//             RETURNING *
//             `,
//             [id, now]
//           );


//           pool.query('UPDATE users SET refreshtoken=$1 WHERE email=$2', [refreshToken, trimmedEmail])
//           //  console.log(result) //Delete before production

//           //http cookie not accesible by js (for security. More secure than localstorage or another cookie)
//           //remove secure: true temporarily if want to test with tunder client. Back in for production
//           res.cookie('jwt', refreshToken, {
//             httpOnly: true, sameSite: "None",
//             secure: true,
//             maxAge: 24 * 60 * 60 * 1000
//           })


          
//           res.json({
//             id, loggedIn,
//             username, isAdmin, isSuperAdmin, isActive, email,
//             // roles, 
//             accessToken
//           });
//           //  res.json({'success': `user ${id} is logged in`});




//         } else {
//           if (result !== true) res.status(401).json({ error: "Enter correct password" });
//         }
//       })
//     }


//   } catch (error) {
//     console.log(error)
//   };

// };



// module.exports = { handleLogin };

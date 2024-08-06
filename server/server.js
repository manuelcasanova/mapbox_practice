require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser')
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials')
const verifyJWT = require('./middleware/verifyJWT');
const PORT = process.env.PORT || 3500;
const pool = require('./config/db');
const { report } = require('./routes/register');
const bcrypt = require('bcrypt')
const multer = require('multer');
const path = require('path'); // To serve static files.
const fs = require('fs');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.userId;
    const uploadPath = path.join(__dirname, `profile_pictures/${userId}`);

    // Ensure the directory exists
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, 'profile_picture.jpg'); // Always save as profile_picture.jpg
  }
});


const upload = multer({ storage });

// WebSocket connection handling
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Handle incoming messages from clients
//   socket.on('message', (message) => {
//     console.log('Received message:', message);
//     // Broadcast message to all connected clients
//     io.emit('message', message); // Broadcast to all connected clients
//   });

//   // Handle disconnections
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

app.set("view engine", 'ejs');

app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'root/server/profile_pictures' directory
app.use('/profile_pictures', express.static(path.join(__dirname, '/profile_pictures')));


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// app.use(cors)

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser())


// -------- START ROUTES --------


///---ROUTES BEFORE JWT TOKEN----

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/forgot-password', require('./routes/forgot-password'));


app.use(verifyJWT);

///ROUTES AFTER JWT TOKEN----

// Endpoint to handle profile picture upload
app.post('/profile_pictures/:userId', upload.single('profilePicture'), async (req, res) => {

  const userId = req.params.userId;
  const profilePicturePath = `profile_pictures/${userId}/profile_picture.jpg`;

  try {
    const updateProfilePictureQuery = `
      UPDATE users
      SET profile_picture = $1
      WHERE id = $2
      RETURNING *
    `;

    const updateResult = await pool.query(updateProfilePictureQuery, [profilePicturePath, userId]);

    // Handle successful update
    if (updateResult.rowCount > 0) {

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.put('/users/edit/password', async (req, res) => {
  try {

    if (!req?.body?.id) {
      return res.status(400).json({ 'message': 'ID parameter is required.' });
    }
    try {

      let hashedPwd;

      const data = await pool.query('SELECT * FROM users WHERE id = $1', [req.body.id])
      const user = data.rows;

      if (!user) {
        return res.status(204).json({ "message": `No user matches ID ${req.body.id}.` });
      }
      if (req.body?.pwd) {
        hashedPwd = await bcrypt.hash(req.body.pwd, 10);
      }
      if (req.body?.pwd)
        await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hashedPwd, req.body.id])
      res.json();

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while resetting the password.' });
    }
  } catch (error) {
    console.error("Error updating password", error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT route to update user's last login
app.post('/users/lastlogin/', async (req, res) => {
  try {
    const { userId, lastlogin } = req.body; 
    const insertLastLogin = await pool.query(
      `
      INSERT INTO login_history (user_id, login_time)
      VALUES ($1, $2)
      RETURNING *
      `,
      [userId, lastlogin]
    );
    res.json(insertLastLogin.rows[0])

  } catch (error) {
    console.error("Error updating user last login", error);
    res.status(500).send("Internal Server Error");
  }
});

//Get all users (Admin)
app.get("/users", async (req, res) => {
  try {
    if (req.query.user && req.query.user.isAdmin) {
      const rides = await pool.query(
        'SELECT * FROM users ORDER BY username'
      );
      res.json(rides.rows)
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message)
  }
});

//Get all users (name only)
app.get("/users/names", async (req, res) => {
  try {

    const filteredUsername = req.query?.filteredUsers?.userName

    let query = `SELECT id, username, isactive FROM users`

    let queryParams = [];

    if (filteredUsername && filteredUsername.toLowerCase() !== "all") {
      query += ` WHERE username ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${filteredUsername}%`);
    }

    query += ` ORDER BY username ASC`;

    const users = await pool.query(query, queryParams)

    res.json(users.rows)


  } catch (err) {
    console.error(err.message)
  }
});

//Modify username
app.post("/users/modifyusername", async (req, res) => {
  const { userId, newUsername } = req.body;

  try {
    await pool.query('UPDATE users SET username = $1 WHERE id = $2', [newUsername, userId]);
    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get muted users
app.get('/users/muted', async (req, res) => {
  const userId = req.query.userId;
  try {

    const result = await pool.query('SELECT * FROM muted WHERE mute = true AND (muter = $1 OR mutee = $1)', [userId]);

    const mutedUsers = result.rows
  
    res.json({ mutedUsers });
  } catch (error) {
    console.error('Error fetching muted users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

// Mute user route
app.post('/users/mute', async (req, res) => {
  const { userLoggedin, userId } = req.body;
  try {
    // Check if the record already exists
    const existingRecord = await pool.query('SELECT * FROM muted WHERE muter = $1 AND mutee = $2', [userLoggedin, userId]);
    if (existingRecord.rows.length === 0) {
      // If record doesn't exist, insert a new one
      await pool.query('INSERT INTO muted (muter, mutee, mute) VALUES ($1, $2, true)', [userLoggedin, userId]);
      res.send('User muted successfully.');
    } else {
      // If record exists, update it
      await pool.query('UPDATE muted SET mute = true WHERE muter = $1 AND mutee = $2', [userLoggedin, userId]);
      res.send('User unmuted successfully.');
    }
  } catch (error) {
    console.error('Error muting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Unmute user route
app.post('/users/unmute', async (req, res) => {
  const { userLoggedin, userId } = req.body;
  try {
    // Check if the record already exists
    const existingRecord = await pool.query('SELECT * FROM muted WHERE muter = $1 AND mutee = $2', [userLoggedin, userId]);
    if (existingRecord.rows.length === 0) {
      // If record doesn't exist, send a message indicating that the user is not muted
      res.send('User is not muted.');
    } else {
      // If record exists, update it to unmute the user
      await pool.query('UPDATE muted SET mute = false WHERE muter = $1 AND mutee = $2', [userLoggedin, userId]);
      res.send('User unmuted successfully.');
    }
  } catch (error) {
    console.error('Error unmuting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Follow a user
app.post("/users/follow", async (req, res) => {
  try {
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const now = req.body.date || new Date(); // Use provided date or current date/time

    if (req.body.user) {
      // Attempt to update existing record
      const updateQuery = `
        UPDATE followers
        SET status = 'pending', lastmodification = $1, newrequest = true
        WHERE follower_id = $2 AND followee_id = $3
        RETURNING *
      `;
      const updateValues = [now, followerId, followeeId];

      // Execute update query
      const updateResult = await pool.query(updateQuery, updateValues);

      // Check if any rows were updated
      if (updateResult.rowCount > 0) {
        res.json(updateResult.rows[0]); // Return updated row
      } else {
        // If no rows were updated, insert new record
        const insertQuery = `
          INSERT INTO followers (follower_id, followee_id, status, lastmodification, newrequest)
          VALUES ($1, $2, 'pending', $3, true)
          RETURNING *
        `;
        const insertValues = [followerId, followeeId, now];

        // Execute insert query
        const insertResult = await pool.query(insertQuery, insertValues);
        res.json(insertResult.rows[0]); // Return inserted row
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Follow a user (psql 9.5 or higher)
// app.post("/users/follow", async (req, res) => {
//   try {

//     const followeeId = req.body.followeeId;
//     const followerId = req.body.followerId;
//     const user = req.body.user;
//     const now = new Date();

//     if (req.body.user) {

//       const insertFollowee = await pool.query(

//         // ON CONFLICT DO UPDATE is supported from PSQL verion 9.5
//         `
//         INSERT INTO followers (follower_id, followee_id, status, lastmodification, newrequest)
//         VALUES ($1, $2, 'pending', $3, true)
//         ON CONFLICT (follower_id, followee_id)
//         DO UPDATE SET status = 'pending' RETURNING *`
      
//         ,
//         [followerId, followeeId, now]
//       );
//       res.json(insertFollowee.rows[0])

//     } else {
//       res.status(403).json({ error: "Unauthorized access" });
//     }

//   } catch (err) {
//     console.error(err.message)
//   }
// });


//Cancel request to follow a user
app.delete("/users/cancel-follow", async (req, res) => {
  try {
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const user = req.body.user;

    if (req.body.user) {
      // Delete the follow request from the database
      const deleteFollowRequest = await pool.query(
        `
        DELETE FROM followers
        WHERE follower_id = $1 AND followee_id = $2
        RETURNING *
        `,
        [followerId, followeeId]
      );

      if (deleteFollowRequest.rows.length === 0) {
        // If no follow request was found to delete, send an error response
        res.status(404).json({ error: "Follow request not found" });
      } else {
        // Send the deleted follow request as response
        res.json(deleteFollowRequest.rows[0]);
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Unfollow a user
app.post("/users/unfollow", async (req, res) => {
  try {
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const user = req.body.user;

    if (req.body.user) {
      const deleteFollower = await pool.query(
        `
        DELETE FROM followers
        WHERE follower_id = $1 AND followee_id = $2
        RETURNING *
        `,
        [followerId, followeeId]
      );

      if (deleteFollower.rows.length === 0) {
        res.status(404).json({ error: "Follower not found" });
      } else {
        res.json(deleteFollower.rows[0]);
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Get pending request users
app.get('/users/pending', async (req, res) => {
  const userId = req.query.userId;
  if (req.query.userId) {

    try {
      const result = await pool.query(`SELECT lastmodification, newrequest, follower_id FROM followers WHERE followee_id = $1 AND status = 'pending' ORDER BY lastmodification DESC`, [userId]);

      const pendingUsers = result.rows.map(row => ({
        follower_id: row.follower_id,
        lastmodification: row.lastmodification,
        newrequest: row.newrequest
      })
      );

      res.json({ pendingUsers });
    } catch (error) {
      console.error('Error fetching pending request users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    res.status(403).json({ error: "Unauthorized access" });
  }
});

// Approve a follower
app.post("/users/approvefollower", async (req, res) => {
  try {
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const date = req.body.date || new Date();

    if (req.body.user) {
      // Attempt to update existing record
      const updateQuery = `
        UPDATE followers
        SET status = 'accepted', lastmodification = $1
        WHERE follower_id = $2 AND followee_id = $3
        RETURNING *
      `;
      const updateValues = [date, followeeId, followerId];

      // Execute update query
      const updateResult = await pool.query(updateQuery, updateValues);

      // Check if any rows were updated
      if (updateResult.rowCount > 0) {
        res.json(updateResult.rows[0]); // Return updated row
      } else {
        // If no rows were updated, insert new record
        const insertQuery = `
          INSERT INTO followers (follower_id, followee_id, status, lastmodification)
          VALUES ($1, $2, 'accepted', $3)
          RETURNING *
        `;
        const insertValues = [followerId, followeeId, date];

        // Execute insert query
        const insertResult = await pool.query(insertQuery, insertValues);
        res.json(insertResult.rows[0]); // Return inserted row
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



//PSQL 9.5
// app.post("/users/approvefollower", async (req, res) => {
//   try {

//     const followeeId = req.body.followeeId;
//     const followerId = req.body.followerId;
//     const user = req.body.user;
//     const date = req.body.date || new Date()

//     if (req.body.user) {
//       const insertFollower = await pool.query(
//         `
//         INSERT INTO followers (follower_id, followee_id, status, lastmodification)
//         VALUES ($1, $2, 'accepted', $3)
//         ON CONFLICT (follower_id, followee_id)
//         DO UPDATE SET status = 'accepted', lastmodification = $3
//         RETURNING *
//         `,
//         [followeeId, followerId, date]
//       );
//       res.json(insertFollower.rows[0])



//     } else {
//       res.status(403).json({ error: "Unauthorized access" });
//     }

//   } catch (err) {
//     console.error(err.message)
//   }
// });

//Dismiss follow request
// Dismiss a follower
app.post("/users/dismissfollower", async (req, res) => {
  try {
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const date = req.body.date || new Date();

    if (req.body.user) {
      // Attempt to update existing record
      const updateQuery = `
        UPDATE followers
        SET status = 'rejected', lastmodification = $1
        WHERE follower_id = $2 AND followee_id = $3
        RETURNING *
      `;
      const updateValues = [date, followeeId, followerId];

      // Execute update query
      const updateResult = await pool.query(updateQuery, updateValues);

      // Check if any rows were updated
      if (updateResult.rowCount > 0) {
        res.json(updateResult.rows[0]); // Return updated row
      } else {
        // If no rows were updated, insert new record
        const insertQuery = `
          INSERT INTO followers (follower_id, followee_id, status, lastmodification)
          VALUES ($1, $2, 'rejected', $3)
          RETURNING *
        `;
        const insertValues = [followerId, followeeId, date];

        // Execute insert query
        const insertResult = await pool.query(insertQuery, insertValues);
        res.json(insertResult.rows[0]); // Return inserted row
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


//PSQL 9.5
// app.post("/users/dismissfollower", async (req, res) => {
//   try {

//     const followeeId = req.body.followeeId;
//     const followerId = req.body.followerId;
//     const user = req.body.user;
//     const date = req.body.date || new Date()

//     if (req.body.user) {
//       const insertFollower = await pool.query(
//         `
//         INSERT INTO followers (follower_id, followee_id, status, lastmodification)
//         VALUES ($1, $2, 'rejected', $3)
//         ON CONFLICT (follower_id, followee_id)
//         DO UPDATE SET status = 'rejected', lastmodification = $3
//         RETURNING *
//         `,
//         [followeeId, followerId, date]
//       );
//       res.json(insertFollower.rows[0])



//     } else {

//       res.status(403).json({ error: "Unauthorized access" });
//     }

//   } catch (err) {
//     console.error(err.message)
//   }
// });

//Dismiss new message follow request
// Dismiss a message follow request
app.post("/users/dismissmessagefollowrequest", async (req, res) => {
  try {
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;

    if (req.body.user) {
      // Attempt to update existing record
      const updateQuery = `
        UPDATE followers
        SET newrequest = false
        WHERE follower_id = $1 AND followee_id = $2
        RETURNING *
      `;
      const updateValues = [followerId, followeeId];

      // Execute update query
      const updateResult = await pool.query(updateQuery, updateValues);

      // Check if any rows were updated
      if (updateResult.rowCount > 0) {
        res.json(updateResult.rows[0]); // Return updated row
      } else {
        // If no rows were updated, insert new record
        const insertQuery = `
          INSERT INTO followers (follower_id, followee_id, newrequest)
          VALUES ($1, $2, false)
          RETURNING *
        `;
        const insertValues = [followerId, followeeId];

        // Execute insert query
        const insertResult = await pool.query(insertQuery, insertValues);
        res.json(insertResult.rows[0]); // Return inserted row
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


//PSQL9.5
// app.post("/users/dismissmessagefollowrequest", async (req, res) => {
//   try {
//     const followeeId = req.body.followeeId;
//     const followerId = req.body.followerId;


//     if (req.body.user) {
//       const insertFollower = await pool.query(
//         `
//         INSERT INTO followers (follower_id, followee_id, newrequest)
//         VALUES ($1, $2, false)
//         ON CONFLICT (follower_id, followee_id)
//         DO UPDATE SET newrequest = false
//         RETURNING *
//         `,
//         [followeeId, followerId]
//       );
//       res.json(insertFollower.rows[0])



//     } else {

//       res.status(403).json({ error: "Unauthorized access" });
//     }

//   } catch (err) {
//     console.error(err.message)
//   }
// });

//Change user permissions

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { isadmin } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET isadmin = $1 WHERE id = $2 RETURNING *',
      [isadmin, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
})

//Get all points
app.get("/points", async (req, res) => {
  try {
    const points = await pool.query(
      'SELECT lat, lng FROM points'
    );
    res.json(points.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get points from one map /maps/:id
app.get("/points/:id", async (req, res) => {


  let id = req.params.id

  try {
    const points = await pool.query(
      'SELECT lat, lng FROM points WHERE map = $1', [id]
    );
    res.json(points.rows)
  } catch (err) {
    console.error(err.message)
  }
});


//Create a point
app.post("/points", async (req, res) => {
  const now = new Date();

  try {
    let lat = req.body.coords[0];
    let lng = req.body.coords[1];
    let mapId = req.body.mapId;

    const newPoint = await pool.query(
      'INSERT INTO points (lat, lng, map, createdat) VALUES ($1, $2, $3, $4)  RETURNING *', [lat, lng, mapId, now]
    );
    res.json(newPoint.rows[0])
  } catch (err) {
    console.error(err.message)
  }
});

//Delete a point
app.post("/points/delete/", async (req, res) => {

  try {

    let lat = req.body.lat;
    let lng = req.body.lng;


    await pool.query(
      "DELETE FROM points WHERE lat = $1 AND lng = $2", [lat, lng]
    )
    res.json("Network Response: The point was deleted")
  } catch (err) {
    console.error(err.message)
  }
})

//Delete all points
app.post("/points/delete/all/:id", async (req, res) => {
  let id = req.params.id
  try {

    await pool.query(
      "DELETE FROM points where map = $1", [id]
    )
    res.json("Network Response: All points were deleted")
  } catch (err) {
    console.error(err.message)
  }
})

//Create a map
app.post("/createmap", async (req, res) => {

  try {


    const newMap = await pool.query("INSERT INTO maps (title, createdby, createdAt, mapType) VALUES($1, $2, $3, $4) RETURNING *", [req.body.title, req.body.auth.userId, req.body.createdAt, req.body.mapType]);

    if (newMap.rows.length === 0) {
      return res.status(500).json({ message: "Failed to create map" });
    }

    const insertedMap = newMap.rows[0];

    res.json(insertedMap);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Add user to map
app.post("/maps/adduser", async (req, res) => {
  try {

    if (!req.body.userId) {
      return res.status(401).json({ message: "A user needs to be logged in" });
    }
    const query = {
      text: 'INSERT INTO map_users (map_id, user_id) VALUES ($1, $2)',
      values: [req.body.mapId, req.body.userId]
    };
    await pool.query(query);


    return res.status(200).json({ message: "User successfully added to the map" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Remove user from map
app.delete("/maps/removeuser", async (req, res) => {
  try {
    const userId = req.body.userId;
    const mapId = req.body.mapId;
    if (!userId || !mapId) {
      return res.status(400).json({ message: "User ID and map ID are required" });
    }

    const query = {
      text: 'DELETE FROM map_users WHERE map_id = $1 AND user_id = $2',
      values: [mapId, userId]
    };
    await pool.query(query);

    return res.status(200).json({ message: "User successfully removed from the map" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Remove user from ride
app.delete("/rides/removeuser", async (req, res) => {
  try {
    const userId = req.body.userId;
    const rideId = req.body.rideId;

    if (!userId || !rideId) {
      return res.status(400).json({ message: "User ID and ride ID are required" });
    }

    const query = {
      text: 'DELETE FROM ride_users WHERE ride_id = $1 AND user_id = $2',
      values: [rideId, userId]
    };
    await pool.query(query);

    return res.status(200).json({ message: "User successfully removed from the map" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Remove user from run
app.delete("/runs/removeuser", async (req, res) => {
  try {
    const userId = req.body.userId;
    const runId = req.body.runId;

    if (!userId || !runId) {
      return res.status(400).json({ message: "User ID and run ID are required" });
    }

    const query = {
      text: 'DELETE FROM run_users WHERE run_id = $1 AND user_id = $2',
      values: [runId, userId]
    };
    await pool.query(query);

    return res.status(200).json({ message: "User successfully removed from the run" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Add user to ride
app.post("/rides/adduser", async (req, res) => {
  try {

    const query = {
      text: 'INSERT INTO ride_users (ride_id, user_id, isprivate) VALUES ($1, $2, $3)',
      values: [req.body.rideId, req.body.userId, req.body.isPrivate]
    };
    await pool.query(query);


    return res.status(200).json({ message: "User successfully added to the ride" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Add user to run
app.post("/runs/adduser", async (req, res) => {
  try {

    const query = {
      text: 'INSERT INTO run_users (run_id, user_id, isprivate) VALUES ($1, $2, $3)',
      values: [req.body.runId, req.body.userId, req.body.isPrivate]
    };
    await pool.query(query);


    return res.status(200).json({ message: "User successfully added to the run" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Create a ride
app.post("/createride", async (req, res) => {
  try {
    const { title, distance, speed, date, time, details, mapId, createdAt, dateString, rideType, userId, meetingPoint } = req.body
    const now = new Date();

    // Check if the date has the format DD/MM/YYYY
    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      return res.status(400).json({ error: 'Invalid date format. Please provide a date in the format DD/MM/YYYY' });
    }

    // Check if the time has the format 00:00:00
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ error: 'Invalid time format. Please provide time in the format HH:MM:SS' });
    }

    // Check if the distance is a positive number
    const distanceRegex = /^\d+(\.\d+)?$/;
    if (!distanceRegex.test(distance)) {
      return res.status(400).json({ error: 'Invalid distance format. Please provide a positive number' });
    }

    // Check if the speed is a positive number
    const speedRegex = /^\d+(\.\d+)?$/;
    if (!speedRegex.test(speed)) {
      return res.status(400).json({ error: 'Invalid speed format. Please provide a positive number' });
    }

    // Check if the userId is a positive number
    const userIdRegex = /^\d+$/;
    if (!userIdRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    //Converts 13/01/2023 to 2023-01-13
    const psqlDate = `${dateString[6] + dateString[7] + dateString[8] + dateString[9] + `-` + dateString[3] + dateString[4] + `-` + dateString[0] + dateString[1]}`

    const newRide = await pool.query(`INSERT INTO rides (name, distance, speed, createdat, map, starting_date, starting_time, ridetype, createdBy, details, meeting_point) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [title, distance, speed, now, mapId, psqlDate, time, rideType, userId, details, meetingPoint])
    res.json(newRide.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//Create a run
app.post("/createrun", async (req, res) => {
  try {
    const { title, distance, pace, date, time, details, mapId, createdAt, dateString, runType, userId, meetingPoint } = req.body
    const now = new Date();

    // Check if the date has the format DD/MM/YYYY
    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      return res.status(400).json({ error: 'Invalid date format. Please provide a date in the format DD/MM/YYYY' });
    }

    // Check if the time has the format 00:00:00
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({ error: 'Invalid time format. Please provide time in the format HH:MM:SS' });
    }

    // Check if the distance is a positive number
    const distanceRegex = /^\d+(\.\d+)?$/;
    if (!distanceRegex.test(distance)) {
      return res.status(400).json({ error: 'Invalid distance format. Please provide a positive number' });
    }

    // Check if the speed is a positive number
    const rangeRegex = /^\d+(\.\d+)?$/;
    if (!rangeRegex.test(pace)) {
      return res.status(400).json({ error: 'Invalid range format. Please provide a positive number' });
    }

    // Check if the userId is a positive number
    const userIdRegex = /^\d+$/;
    if (!userIdRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    //Converts 13/01/2023 to 2023-01-13
    const psqlDate = `${dateString[6] + dateString[7] + dateString[8] + dateString[9] + `-` + dateString[3] + dateString[4] + `-` + dateString[0] + dateString[1]}`

    const newRun = await pool.query(`INSERT INTO runs (name, distance, pace, createdat, map, starting_date, starting_time, runtype, createdBy, details, meeting_point) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [title, distance, pace, now, mapId, psqlDate, time, runType, userId, details, meetingPoint])
    res.json(newRun.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//Delete a map
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.body.mapId;
    const userId = req.body.userId
    const mapCreatedBy = req.body.mapCreatedBy
    const isMapCreatedByUser = req.body.isMapCreatedByUser

    if (isMapCreatedByUser) {

      await pool.query(
        "DELETE FROM maps WHERE id = $1 RETURNING *", [id]
      )
      res.json("The map was deleted")

    } else {
      res.json("Map can only be deleted by creator")
    }

  } catch (err) {
    console.error(err.message)
  }
})

//Deactivate a map
app.post("/deactivate/:id", async (req, res) => {
  try {
    const mapId = req.params.id;
    const userId = req.body.data.userId
    const mapCreatedBy = req.body.data.mapCreatedBy
    const isMapCreatedByUser = req.body.data.isMapCreatedByUser

    if (isMapCreatedByUser) {


      const deactivateMap = await pool.query(
        "UPDATE maps SET isactive = false WHERE id = $1 RETURNING *", [mapId]
      )
      res.json(deactivateMap.rows[0])

    } else {
      res.json("Map can only be deactivated by creator")
    }

  } catch (err) {
    console.error(err.message)
  }
})

//Delete a ride
app.delete("/rides/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = req.body.user;

    if (user.isAdmin) {


      await pool.query(
        "DELETE FROM rides WHERE id = $1 RETURNING *", [id]
      )
      res.json("The ride was deleted")

    } else {
      res.json("Ride can only be deleted by administrator")
    }

  } catch (err) {
    console.error(err.message)
  }
})

//Delete a run
app.delete("/runs/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = req.body.user;

    if (user.isAdmin) {


      await pool.query(
        "DELETE FROM runs WHERE id = $1 RETURNING *", [id]
      )
      res.json("The run was deleted")

    } else {
      res.json("Run can only be deleted by administrator")
    }

  } catch (err) {
    console.error(err.message)
  }
})

//Deactivate a ride
app.post("/ride/deactivate/:id", async (req, res) => {

  try {
    const rideId = Number(req.params.id);
    const userId = req.body.data.userId
    const rideCreatedBy = req.body.data.rideCreatedBy
    const isRideCreatedByUser = req.body.data.isRideCreatedByUser
    const isAdmin = req.body.data.auth.isAdmin


    if (isRideCreatedByUser || isAdmin) {

      const deactivatedRide = await pool.query(
        "UPDATE rides SET isactive = false WHERE id = $1 RETURNING *", [rideId]
      )
      res.json(deactivatedRide.rows[0])

    } else {
      res.json("Ride can only be deactivated by creator")
    }

  } catch (err) {
    console.error(err.message)
  }
})



//Deactivate a run
app.post("/run/deactivate/:id", async (req, res) => {

  try {
    const rideId = Number(req.params.id);

    const userId = req.body.data.userId
    const runCreatedBy = req.body.data.runCreatedBy
    const isRunCreatedByUser = req.body.data.isRunCreatedByUser
    const isAdmin = req.body.data.auth.isAdmin


    if (isRunCreatedByUser || isAdmin) {

      const deactivatedRun = await pool.query(
        "UPDATE runs SET isactive = false WHERE id = $1 RETURNING *", [rideId]
      )
      res.json(deactivatedRun.rows[0])

    } else {
      res.json("Run can only be deactivated by creator")
    }

  } catch (err) {
    console.error(err.message)
  }
})

//Remove users from map

app.delete(`/maps/delete/users/:id`, async (req, res) => {
  try {
    console.log("rb", req.body)
    const userId = parseInt(req.body.userId);
    const mapId = parseInt(req.body.mapId);
    if (!userId || !mapId) {
      return res.status(400).json({ message: "User ID and map ID are required" });
    }
    const query = {
      text: 'DELETE FROM map_users WHERE map_id = $1 AND user_id = $2',
      values: [mapId, userId]
    };

    await pool.query(query);

    return res.status(200).json({ message: "User successfully removed from the map" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});




//Remove users from ride
app.delete(`/rides/delete/users/:id`, async (req, res) => {
  try {
    const userId = req.body.userId;
    const rideId = req.params.id;

    if (!userId || !rideId) {
      return res.status(400).json({ message: "User ID and map ID are required" });
    }

    const query = {
      text: 'DELETE FROM ride_users WHERE ride_id = $1 AND user_id = $2',
      values: [rideId, userId]
    };
    await pool.query(query);

    return res.status(200).json({ message: "User successfully removed from the ride" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



//Remove users from run
app.delete(`/runs/delete/users/:id`, async (req, res) => {
  try {

    const userId = req.body.userId;
    const runId = req.params.id;

    if (!userId || !runId) {
      return res.status(400).json({ message: "User ID and run ID are required" });
    }

    const query = {
      text: 'DELETE FROM run_users WHERE run_id = $1 AND user_id = $2',
      values: [runId, userId]
    };
    await pool.query(query);

    return res.status(200).json({ message: "User successfully removed from the run" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Delete a user
app.delete("/user/delete/:id", async (req, res) => {
  try {

    const userToDeleteIsSuperAdmin = req.body.userObject.issuperadmin;

    if (req.body.loggedInUser.isSuperAdmin && !userToDeleteIsSuperAdmin) {

      // Construct the path to the profile picture folder
      const uploadPath = path.join(__dirname, `profile_pictures/${req.body.user}`);

      // Check if the directory exists
      if (fs.existsSync(uploadPath)) {
        // Delete directory recursively
        fs.rmSync(uploadPath, { recursive: true });
      }

      // Delete user from the database
      const deleteQuery = `
   DELETE FROM users
   WHERE id = $1
   RETURNING *
 `;
      const deleteResult = await pool.query(deleteQuery, [req.body.user]);

      if (deleteResult.rowCount > 0) {
        res.json({ message: 'User and associated profile picture deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }


    } else {
      res.json("Users can only be deleted by Super Admins")
    }

  } catch (err) {
    console.error('Error deleting user and profile picture:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})



//Activate a user
app.post("/user/activate/:id", async (req, res) => {
  try {
    const isLoggedIn = req.body.isUserLoggedIn
    const userId = req.body.userId

    if (isLoggedIn) {

      const activateUser = await pool.query(
        "UPDATE users SET isactive = true, email = REPLACE(email, CONCAT(SUBSTRING(email FROM '^[0-9]+'), '-'), '') WHERE id = $1 RETURNING *",
        [userId]
      );

      res.json(activateUser.rows[0])

    } else {
      res.json("User can only be activated by user if logged in")
    }

  } catch (err) {
    console.error(err.message)
  }
})


//Deactivate a user
app.post("/user/deactivate/:id", async (req, res) => {
  try {
    const isLoggedIn = req.body.isUserLoggedIn
    const userId = req.body.userId

    if (isLoggedIn) {

          // Construct the path to the profile picture folder
          const uploadPath = path.join(__dirname, `profile_pictures/${req.body.userId}`);

          // Check if the directory exists
          if (fs.existsSync(uploadPath)) {
            // Delete directory recursively
            fs.rmSync(uploadPath, { recursive: true });
          }


      const deactivateUser = await pool.query(
        "UPDATE users SET isactive = false, email = CONCAT(TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISSMS'), '-', email) WHERE id = $1 RETURNING *",
        [userId]
      );

      res.json(deactivateUser.rows[0])

    } else {
      res.json("User can only be deactivated by user if logged in")
    }

  } catch (err) {
    console.error(err.message)
  }
})


// Get all public maps 
app.get("/maps/public", async (req, res) => {
  try {
    const userId = req.query.user.userId;
    const username = req.query?.filteredMaps?.userName;
    const title = req.query?.filteredMaps?.title;
    const browCoords = req.query?.browCoords;

    console.log("brow Coords in server maps/public", browCoords);

    let query = `
    SELECT DISTINCT m.*, fp.lat AS first_point_lat, fp.lng AS first_point_lng
    `;

    let queryParams = [userId];

    if (browCoords) {
      const [lat, lng] = browCoords;
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      query += `,
      (3959 * acos(cos(radians($${queryParams.length + 1})) * cos(radians(fp.lat)) * cos(radians(fp.lng) - radians($${queryParams.length + 2})) + sin(radians($${queryParams.length + 1})) * sin(radians(fp.lat)))) AS distance
      `;
      queryParams.push(userLat, userLng);
    }

    query += `
    FROM maps m
    LEFT JOIN followers f ON m.createdby = f.followee_id
    LEFT JOIN muted mute1 ON mute1.muter = $1 AND mute1.mutee = m.createdby
    LEFT JOIN muted mute2 ON mute2.muter = m.createdBy AND mute2.mutee = $1
    INNER JOIN users u1 ON m.createdby = u1.id
    INNER JOIN users u2 ON $1 = u2.id
    LEFT JOIN (
        SELECT p.map, p.lat, p.lng
        FROM points p
        INNER JOIN (
            SELECT map, MIN(id) AS first_point_id
            FROM points
            GROUP BY map
        ) first_points ON p.id = first_points.first_point_id
    ) fp ON m.id = fp.map
    WHERE (m.maptype = 'public' 
           OR (m.maptype = 'followers' AND f.follower_id = $1) 
           OR (m.createdby = $1))
    AND (mute1.mute IS NULL OR mute1.mute = false)
    AND (mute2.mute IS NULL OR mute2.mute = false)
    AND m.isactive = true
    AND u1.isactive = true
    AND u2.isactive = true
    `;

    if (title && title.toLowerCase() !== 'all') {
      query += ` AND m.title ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${title}%`);
    }

    if (username && username.toLowerCase() !== 'all') {
      query += ` AND u1.username ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${username}%`);
    }

    if (browCoords) {
      // Order by distance if browCoords is provided
      query += ` ORDER BY distance ASC`;
    } else {
      // Order by map ID if browCoords is not provided
      query += ` ORDER BY m.createdat DESC`;
    }

    const maps = await pool.query(query, queryParams);
    // console.log("maps rows", maps.rows);
    res.json(maps.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



//Get maps from user
app.get("/maps/", async (req, res) => {
  try {

    const userId = req.query.userId;
    const maps = await pool.query(


      `SELECT * 
      FROM maps 
      WHERE createdby = $1 
      AND isactive = true 
      
      UNION 
      
      SELECT maps.* 
      FROM maps 
      INNER JOIN map_users ON maps.id = map_users.map_id 
      
      WHERE map_users.user_id = $1 
      AND maps.isactive = true 
      ORDER BY id DESC`

      ,


      [userId]

    );
    res.json(maps.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get maps with other users
app.get("/maps/otherusers", async (req, res) => {
  try {

    const userId = req.query.userId;
    const maps = await pool.query(
      'SELECT * FROM map_users'
    );
    res.json(maps.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get rides with other users
app.get("/rides/otherusers", async (req, res) => {
  try {

    const rides = await pool.query(
      'SELECT * FROM ride_users'
    );
    res.json(rides.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get runs with other users
app.get("/runs/otherusers", async (req, res) => {
 
  try {

    const runs = await pool.query(
      'SELECT * FROM run_users'
    );

    res.json(runs.rows)

  } catch (err) {
    console.error(err.message)
  }
});

//Get maps from other users, if they are public and we added them to "our maps"

app.get("/maps/shared", async (req, res) => {

  try {
    const userId = req.query.userId;

    // Query to retrieve maps associated with the user through map_users
    const mapsQuery = `
      SELECT m.*
      FROM maps m
      JOIN map_users mu ON m.id = mu.map_id
      WHERE mu.user_id = $1
      AND m.isactive = true
      
      UNION
      
      SELECT m.*
      FROM maps m
      WHERE m.createdby = $1
      AND m.isactive = true
      ORDER BY id DESC`;

    const maps = await pool.query(mapsQuery, [userId]);
    res.json(maps.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
});

//Get one map
app.get("/maps/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const maps = await pool.query(
      'SELECT * FROM maps WHERE id = $1', [id]
    );
    res.json(maps.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get all rides (admin)
app.get("/rides", async (req, res) => {
  try {
    const userId = req.query.user.userId
    if (req.query.user && req.query.user.accessToken) {
      if (req.query.filteredRides) {

        const dateStart = req.query.filteredRides.dateStart
        const dateEnd = req.query.filteredRides.dateEnd
        const distanceMin = req.query.filteredRides.distanceMin
        const distanceMax = req.query.filteredRides.distanceMax
        const speedRangeMin = req.query.filteredRides.speedMin
        const speedRangeMax = req.query.filteredRides.speedMax
        const rideName = req.query.filteredRides.rideName;
        const rId = req.query.filteredRides.rId

        if (!dateStart || !dateEnd || !distanceMin || !distanceMax || !speedRangeMin || !speedRangeMax || !rideName) {
          console.log("One or more parameters are missing or invalid");
          return res.status(400).json({ error: "Missing or invalid parameters" });
        }


        let ridesQuery = `
     SELECT DISTINCT r.*
     FROM rides r
     WHERE starting_date >= $1
     AND starting_date <= $2
       AND distance >= $3
       AND distance <= $4
       AND speed >= $5
       AND speed <= $6
   `

        let queryParams = [
          dateStart, dateEnd,
          distanceMin, distanceMax, speedRangeMin, speedRangeMax
        ];

        if (rId !== '0') {
          ridesQuery += `AND id = $7`;
          queryParams.push(rId);
        }

        if (rideName && rideName !== "all") {
          ridesQuery += ` AND name ILIKE $${queryParams.length + 1}`;
          queryParams.push(`%${rideName}%`);
        }


        const rides = await pool.query(ridesQuery, queryParams);
        res.json(rides.rows);

      } else {
        const rides = await pool.query(`
        SELECT DISTINCT r.* 
        FROM rides r
        `, [userId]);
        res.json(rides.rows);
      }
    } else {

      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message)
  }
});

//Get all runs (admin)
app.get("/runs", async (req, res) => {
  try {
    const userId = req.query.user ? req.query.user.userId : null;
    if (req.query.user && req.query.user.accessToken) {
      if (req.query.filteredRuns) {

        const {
          dateStart,
          dateEnd,
          distanceMin,
          distanceMax,
          speedMin,
          speedMax,
          runName,
          rId
        } = req.query.filteredRuns;

        if (!dateStart || !dateEnd || !distanceMin || !distanceMax || !speedMin || !speedMax || !rId) {
          console.log("One or more parameters are missing or invalid");
          return res.status(400).json({ error: "Missing or invalid parameters" });
        }

        let runsQuery = `
          SELECT DISTINCT r.*
          FROM runs r
          WHERE starting_date >= $1
          AND starting_date <= $2
          AND distance >= $3
          AND distance <= $4
          AND pace >= $5
          AND pace <= $6
        
        `;

        let queryParams = [
          dateStart, dateEnd,
          distanceMin, distanceMax, speedMin, speedMax
        ];

        if (rId !== '0') {
          runsQuery += `AND id = $7`;
          queryParams.push(rId);
        }

        if (runName && runName !== "all") {
          runsQuery += ` AND name ILIKE $${queryParams.length + 1}`;
          queryParams.push(`%${runName}%`);
        }

        const runs = await pool.query(runsQuery, queryParams);
        res.json(runs.rows);
      } else {
        // Fetch all runs
        const runs = await pool.query(`
          SELECT DISTINCT r.* 
          FROM runs r
        `, [userId]);

        res.json(runs.rows);
      }
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error("Error in /runs endpoint: ", err.message, err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get all public rides (user)
app.get("/rides/public", async (req, res) => {
  try {
    if (req.query.user && req.query.user.accessToken) {
      const userId = req.query.user.userId
      if (req.query.filteredRides) {
        const dateStart = req.query.filteredRides.dateStart
        const dateEnd = req.query.filteredRides.dateEnd
        const distanceMin = req.query.filteredRides.distanceMin
        const distanceMax = req.query.filteredRides.distanceMax
        const speedRangeMin = req.query.filteredRides.speedMin
        const speedRangeMax = req.query.filteredRides.speedMax
        const rideName = req.query.filteredRides.rideName



        let ridesQuery = `
     SELECT DISTINCT r.*
     FROM rides r
     LEFT JOIN followers f ON r.createdby = f.followee_id
     LEFT JOIN muted mute1 ON mute1.muter = $7 AND mute1.mutee = r.createdby
     LEFT JOIN muted mute2 ON mute2.muter = r.createdby AND mute2.mutee = $7
     INNER JOIN users u1 ON r.createdby = u1.id
     INNER JOIN users u2 ON $7 = u2.id
     WHERE (r.ridetype='public' OR (r.ridetype = 'followers' and f.follower_id = $7 and f.status = 'accepted') OR (r.createdby = $7))
     AND starting_date >= $1
     AND starting_date <= $2
       AND distance >= $3
       AND distance <= $4
       AND speed >= $5
       AND speed <= $6
       AND (mute1.mute IS NULL OR mute1.mute = false)
       AND (mute2.mute IS NULL OR mute2.mute = false)
       AND r.isactive = true
       AND u1.isactive = true
       AND u2.isactive = true
       ORDER BY starting_date
   `

        let queryParams = [
          dateStart, dateEnd,
          distanceMin, distanceMax, speedRangeMin, speedRangeMax, userId
        ];

        if (rideName && rideName !== "all") {
          ridesQuery += ` AND name ILIKE $8`;
          queryParams.push(`%${rideName}%`);
        }

        const rides = await pool.query(ridesQuery, queryParams);
        res.json(rides.rows);


      } else {
        const rides = await pool.query(`
        SELECT DISTINCT r.* 
        FROM rides r
        LEFT JOIN followers f ON r.createdby = f.followee_id
        LEFT JOIN muted mute1 ON mute1.muter = $1 AND mute1.mutee = r.createdby
        LEFT JOIN muted mute2 ON mute2.muter = r.createdby AND mute2.mutee = $1
        WHERE (r.ridetype='public' OR (r.ridetype = 'followers' and f.follower_id = $1 and f.status = 'accepted') OR (r.createdby = $1))
        AND r.isactive = true
        AND (mute1.mute IS NULL OR mute1.mute = false)
        AND (mute2.mute IS NULL OR mute2.mute = false)
        ORDER BY starting_date
        `, [userId]);

        res.json(rides.rows);
      }
    } else {

      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message)
  }
});

//Get all public runs (user)
app.get("/runs/public", async (req, res) => {
  try {
    if (req.query.user && req.query.user.accessToken) {
      const userId = req.query.user.userId
      if (req.query.filteredRuns) {
        const dateStart = req.query.filteredRuns.dateStart
        const dateEnd = req.query.filteredRuns.dateEnd
        const distanceMin = req.query.filteredRuns.distanceMin
        const distanceMax = req.query.filteredRuns.distanceMax
        const paceRangeMin = req.query.filteredRuns.paceMin
        const paceRangeMax = req.query.filteredRuns.paceMax
        const runName = req.query.filteredRuns.runName
        let runsQuery = `
     SELECT DISTINCT r.*
     FROM runs r
     LEFT JOIN followers f ON r.createdby = f.followee_id
     LEFT JOIN muted mute1 ON mute1.muter = $7 AND mute1.mutee = r.createdby
     LEFT JOIN muted mute2 ON mute2.muter = r.createdby AND mute2.mutee = $7
     INNER JOIN users u1 ON r.createdby = u1.id
     INNER JOIN users u2 ON $7 = u2.id
     WHERE (r.runtype='public' OR (r.runtype = 'followers' and f.follower_id = $7 and f.status = 'accepted') OR (r.createdby = $7))
     AND starting_date >= $1
     AND starting_date <= $2
       AND distance >= $3
       AND distance <= $4
       AND pace >= $5
       AND pace <= $6
       AND (mute1.mute IS NULL OR mute1.mute = false)
       AND (mute2.mute IS NULL OR mute2.mute = false)
       AND r.isactive = true
       AND u1.isactive = true
       AND u2.isactive = true
       ORDER BY starting_date
   `;

        let queryParams = [
          dateStart, dateEnd,
          distanceMin, distanceMax, paceRangeMin, paceRangeMax, userId
        ];

        if (runName && runName !== "all") {
          runsQuery += ` AND name ILIKE $8`;
          queryParams.push(`%${runName}%`);
        }

        const runs = await pool.query(runsQuery, queryParams);
        res.json(runs.rows);

      } else {

        const runs = await pool.query(`
        SELECT DISTINCT r.* 
        FROM runs r
        LEFT JOIN followers f ON r.createdby = f.followee_id
        LEFT JOIN muted mute1 ON mute1.muter = $1 AND mute1.mutee = r.createdby
        LEFT JOIN muted mute2 ON mute2.muter = r.createdby AND mute2.mutee = $1
        WHERE (r.runtype='public' OR (r.runtype = 'followers' and f.follower_id = $1 and f.status = 'accepted') OR (r.createdby = $1))
        AND r.isactive = true
        AND (mute1.mute IS NULL OR mute1.mute = false)
        AND (mute2.mute IS NULL OR mute2.mute = false)
        ORDER BY starting_date
        `, [userId]);
        console.log("no filtered runs")
        res.json(runs.rows);
      }

    } else {

      res.status(403).json({ error: "Unauthorized access" });
    }


  } catch (err) {
    console.error(err.message)
  }
});

//Get users rides
app.get("/rides/user/:id", async (req, res) => {

  try {
    const { id } = req.params;
    const dateStart = req.query.filteredRides.dateStart
    const dateEnd = req.query.filteredRides.dateEnd
    const distanceMin = req.query.filteredRides.distanceMin
    const distanceMax = req.query.filteredRides.distanceMax
    const speedRangeMin = req.query.filteredRides.speedMin
    const speedRangeMax = req.query.filteredRides.speedMax
    const rideName = `%${req.query.filteredRides.rideName}%`

    if (id === null || id === undefined) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    let ridesQueryNoName =
      `SELECT *
    FROM rides
    WHERE createdby = $1
      AND starting_date >= $2 
      AND starting_date <= $3 
      AND distance >= $4  
      AND distance <= $5 
      AND speed >= $6 
      AND speed <= $7 
      AND isactive = true 
    
    UNION 
    
    SELECT rides.*
    FROM rides
    INNER JOIN ride_users ON rides.id = ride_users.ride_id
    WHERE ride_users.user_id = $1 
      AND starting_date >= $2 
      AND starting_date <= $3
      AND distance >= $4 
      AND distance <= $5 
      AND speed >= $6 
      AND speed <= $7 
      AND NOT EXISTS (
        SELECT 1
        FROM muted
        WHERE (muter = $1 OR mutee = $1)
          AND (rides.createdby = muter OR rides.createdby = mutee)
          AND mute = true
      )
    ORDER BY id DESC;
    `

    let ridesQueryName =
      `SELECT *
    FROM rides
    WHERE createdby = $1
      AND starting_date >= $2 
      AND starting_date <= $3 
      AND distance >= $4  
      AND distance <= $5 
      AND speed >= $6 
      AND speed <= $7 
      AND isactive = true 
      AND name ILIKE $8
    
    UNION 
    
    SELECT rides.*
    FROM rides
    INNER JOIN ride_users ON rides.id = ride_users.ride_id
    WHERE ride_users.user_id = $1 
      AND starting_date >= $2 
      AND starting_date <= $3
      AND distance >= $4 
      AND distance <= $5 
      AND speed >= $6 
      AND speed <= $7 
      AND NOT EXISTS (
        SELECT 1
        FROM muted
        WHERE (muter = $1 OR mutee = $1)
          AND (rides.createdby = muter OR rides.createdby = mutee)
          AND mute = true
      )
          AND name ILIKE $8
    ORDER BY id DESC;
    `

    let queryParamsNoName = [id, dateStart, dateEnd, distanceMin, distanceMax, speedRangeMin, speedRangeMax]

    let queryParamsName = [id, dateStart, dateEnd, distanceMin, distanceMax, speedRangeMin, speedRangeMax, rideName]


    const rides = !rideName || rideName === "%all%" ? await pool.query(ridesQueryNoName, queryParamsNoName) : await pool.query(ridesQueryName, queryParamsName);

    res.json(rides.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Get users runs
app.get("/runs/user/:id", async (req, res) => {

  try {
    const { id } = req.params;
    const dateStart = req.query.filteredRuns.dateStart
    const dateEnd = req.query.filteredRuns.dateEnd
    const distanceMin = req.query.filteredRuns.distanceMin
    const distanceMax = req.query.filteredRuns.distanceMax
    const paceRangeMin = req.query.filteredRuns.paceMin
    const paceRangeMax = req.query.filteredRuns.paceMax
    const runName = `%${req.query.filteredRuns.runName}%`

    if (id === null || id === undefined) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    let runsQueryNoName =
      `SELECT *
      FROM runs
      WHERE createdby = $1
        AND starting_date >= $2 
        AND starting_date <= $3 
        AND distance >= $4  
        AND distance <= $5 
        AND pace >= $6 
        AND pace <= $7 
        AND isactive = true 
      
      UNION 
      
      SELECT runs.*
      FROM runs
      INNER JOIN run_users ON runs.id = run_users.run_id
      WHERE run_users.user_id = $1 
        AND starting_date >= $2 
        AND starting_date <= $3
        AND distance >= $4 
        AND distance <= $5 
        AND pace >= $6 
        AND pace <= $7 
        AND NOT EXISTS (
          SELECT 1
          FROM muted
          WHERE (muter = $1 OR mutee = $1)
            AND (runs.createdby = muter OR runs.createdby = mutee)
            AND mute = true
        )
      ORDER BY id DESC;
      `

    let runsQueryName =
      `SELECT *
      FROM runs
      WHERE createdby = $1
        AND starting_date >= $2 
        AND starting_date <= $3 
        AND distance >= $4  
        AND distance <= $5 
        AND pace >= $6 
        AND pace <= $7 
        AND isactive = true 
        AND name ILIKE $8
      
      UNION 
      
      SELECT runs.*
      FROM runs
      INNER JOIN run_users ON runs.id = run_users.run_id
      WHERE run_users.user_id = $1 
        AND starting_date >= $2 
        AND starting_date <= $3
        AND distance >= $4 
        AND distance <= $5 
        AND pace >= $6 
        AND pace <= $7 
        AND NOT EXISTS (
          SELECT 1
          FROM muted
          WHERE (muter = $1 OR mutee = $1)
            AND (runs.createdby = muter OR runs.createdby = mutee)
            AND mute = true
        )
            AND name ILIKE $8
      ORDER BY id DESC;
      `

    let queryParamsNoName = [id, dateStart, dateEnd, distanceMin, distanceMax, paceRangeMin, paceRangeMax]

    let queryParamsName = [id, dateStart, dateEnd, distanceMin, distanceMax, paceRangeMin, paceRangeMax, runName]


    const runs = !runName || runName === "%all%" ? await pool.query(runsQueryNoName, queryParamsNoName) : await pool.query(runsQueryName, queryParamsName);

    res.json(runs.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/rides/messages', async (req, res) => {
  const { ride_id } = req.query;
  try {
    const rideMessages = await pool.query('SELECT * FROM ride_message WHERE ride_id = $1 ORDER BY createdat DESC', [ride_id]);
    res.json(rideMessages.rows);

  } catch (err) {
    console.error('Error fetching ride messages:', err);
    res.status(500).json({ error: 'An error occurred while fetching ride messages' });
  }
});

app.get('/runs/messages', async (req, res) => {
  const { run_id } = req.query;
  try {
    const runMessages = await pool.query('SELECT * FROM run_message WHERE run_id = $1 ORDER BY createdat DESC', [run_id]);
    res.json(runMessages.rows);

  } catch (err) {
    console.error('Error fetching ride messages:', err);
    res.status(500).json({ error: 'An error occurred while fetching run messages' });
  }
});

app.get("/rides/messages/reported", async (req, res) => {
  const isAdmin = req.query.isAdmin;
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin permission required.' });
  } else {
    try {
      const reportedMessages = await pool.query(`SELECT * from ride_message WHERE status = 'reported' ORDER BY reportedat DESC;`);
      res.json(reportedMessages.rows)
    } catch (err) {
      console.error('Error fetching ride messages:', err);
      res.status(500).json({ error: 'An error occurred while fetching ride messages' });
    }
  }
});

app.get("/rides/messages/flagged", async (req, res) => {
  const isAdmin = req.query.isAdmin;
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin permission required.' });
  } else {
    try {
      const flaggedMessages = await pool.query(`SELECT * from ride_message WHERE status = 'flagged';`);
      res.json(flaggedMessages.rows)
    } catch (err) {
      console.error('Error fetching ride messages:', err);
      res.status(500).json({ error: 'An error occurred while fetching ride messages' });
    }
  }
});

app.get("/runs/messages/reported", async (req, res) => {
  const isAdmin = req.query.isAdmin;
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin permission required.' });
  } else {
    try {

      const reportedMessages = await pool.query(`SELECT * from run_message WHERE status = 'reported' ORDER BY reportedat DESC;`);
      res.json(reportedMessages.rows)
    } catch (err) {
      console.error('Error fetching run messages:', err);
      res.status(500).json({ error: 'An error occurred while fetching run messages' });
    }
  }
});

app.get("/runs/messages/flagged", async (req, res) => {
  const isAdmin = req.query.isAdmin;
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin permission required.' });
  } else {
    try {
      const flaggedMessages = await pool.query(`SELECT * from run_message WHERE status = 'flagged'`);
      res.json(flaggedMessages.rows)
    } catch (err) {
      console.error('Error fetching run messages:', err);
      res.status(500).json({ error: 'An error occurred while fetching run messages' });
    }
  }
});

app.post("/rides/addmessage", async (req, res) => {
  if (req.body.message !== ""
  ) {
    try {
      const rideId = req.body.rideId;
      const createdBy = req.body.userId;
      const message = req.body.message;
      const now = new Date();

      const insertMessageQuery = {
        text: `
          INSERT INTO ride_message (ride_id, createdby, message, createdat)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
        values: [rideId, createdBy, message, now]
      };

      const insertedMessage = await pool.query(insertMessageQuery);

      // Emit the new message to all connected clients via websocket
      io.emit('message', insertedMessage.rows[0]);

      res.status(201).json({ message: "Message added successfully", data: insertedMessage.rows });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "An error occurred while adding the message" });
    }
  } else {
    res.status(403).json({ error: "Unauthorized access" });
  }
});

app.post("/runs/addmessage", async (req, res) => {

  if (req.body.message !== ""
  ) {
    try {
      const runId = req.body.runId;
      const createdBy = req.body.userId;
      const message = req.body.message;
      const now = new Date();

      const insertMessageQuery = {
        text: `
          INSERT INTO run_message (run_id, createdby, message, createdat)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
        values: [runId, createdBy, message, now]
      };

      const insertedMessage = await pool.query(insertMessageQuery);


      res.status(201).json({ message: "Message added successfully", data: insertedMessage.rows });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "An error occurred while adding the message" });
    }
  } else {
    res.status(403).json({ error: "Unauthorized access" });
  }
});

// Delete a message from ride messages
app.post("/rides/message/delete/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Attempt to update existing record
    const updateQuery = `
      UPDATE ride_message
      SET status = 'deleted'
      WHERE id = $1
      RETURNING *
    `;
    const updateValues = [messageId];

    // Execute update query
    const updateResult = await pool.query(updateQuery, updateValues);

    // Check if any rows were updated
    if (updateResult.rowCount > 0) {
      res.json(updateResult.rows[0]); // Return updated row
    } else {
      // If no rows were updated, insert new record
      const insertQuery = `
        INSERT INTO ride_message (id, status)
        VALUES ($1, 'deleted')
        RETURNING *
      `;
      const insertValues = [messageId];

      // Execute insert query
      const insertResult = await pool.query(insertQuery, insertValues);
      res.json(insertResult.rows[0]); // Return inserted row
    }

  } catch (error) {
    console.error("Error deleting message", error);
    res.status(500).send("Internal Server Error");
  }
});


//PSQL 9.5
// app.post("/rides/message/delete/:messageId", async (req, res) => {

//   try {
//     const messageId = req.params.messageId

//     const modifyStatus = await pool.query(
//       `
//       INSERT INTO ride_message (id)
//       VALUES ($1)
//       ON CONFLICT (id)
//       DO UPDATE SET status = 'deleted'
//       RETURNING *
//       `,
//       [messageId]
//     );
//     res.json(modifyStatus.rows[0])

//   } catch (error) {
//     console.error("Error deleting message", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// Delete a message in run messages
app.post("/runs/message/delete/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Attempt to update existing record
    const updateQuery = `
      UPDATE run_message
      SET status = 'deleted'
      WHERE id = $1
      RETURNING *
    `;
    const updateValues = [messageId];

    // Execute update query
    const updateResult = await pool.query(updateQuery, updateValues);

    // Check if any rows were updated
    if (updateResult.rowCount > 0) {
      res.json(updateResult.rows[0]); // Return updated row
    } else {
      // If no rows were updated, insert new record
      const insertQuery = `
        INSERT INTO run_message (id, status)
        VALUES ($1, 'deleted')
        RETURNING *
      `;
      const insertValues = [messageId];

      // Execute insert query
      const insertResult = await pool.query(insertQuery, insertValues);
      res.json(insertResult.rows[0]); // Return inserted row
    }

  } catch (error) {
    console.error("Error deleting message", error);
    res.status(500).send("Internal Server Error");
  }
});


//PSQL 9.5
// app.post("/runs/message/delete/:messageId", async (req, res) => {

//   try {

//     const messageId = req.params.messageId

//     const modifyStatus = await pool.query(
//       `
//       INSERT INTO run_message (id)
//       VALUES ($1)
//       ON CONFLICT (id)
//       DO UPDATE SET status = 'deleted'
//       RETURNING *
//       `,
//       [messageId]
//     );
//     res.json(modifyStatus.rows[0])

//   } catch (error) {
//     console.error("Error deleting message", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Report a message in ride messages
app.post("/rides/message/report/", async (req, res) => {
  try {
    const messageId = req.body.messageId;
    const now = new Date();
    const userLoggedInId = req.body.userLoggedInId;

    // Attempt to update existing record
    const updateQuery = `
      UPDATE ride_message
      SET status = 'reported', reportedat = $1, reportedby = $2
      WHERE id = $3
      RETURNING *
    `;
    const updateValues = [now, userLoggedInId, messageId];

    // Execute update query
    const updateResult = await pool.query(updateQuery, updateValues);

    // Check if any rows were updated
    if (updateResult.rowCount > 0) {
      res.json(updateResult.rows[0]); // Return updated row
    } else {
      // If no rows were updated, insert new record
      const insertQuery = `
        INSERT INTO ride_message (id, reportedat, reportedby, status)
        VALUES ($1, $2, $3, 'reported')
        RETURNING *
      `;
      const insertValues = [messageId, now, userLoggedInId];

      // Execute insert query
      const insertResult = await pool.query(insertQuery, insertValues);
      res.json(insertResult.rows[0]); // Return inserted row
    }

  } catch (error) {
    console.error("Error reporting message", error);
    res.status(500).send("Internal Server Error");
  }
});


//PSQL 9.5
// app.post("/rides/message/report/", async (req, res) => {
//   try {


//     const messageId = req.body.messageId
//     const now = new Date();
//     const userLoggedInId = req.body.userLoggedInId

//     const modifyStatus = await pool.query(
//       `
//       INSERT INTO ride_message (id, reportedat, reportedby)
//       VALUES ($1, $2, $3)
//       ON CONFLICT (id)
//       DO UPDATE SET 
//       status = 'reported',
//       reportedat = $2,
//       reportedby = $3
//       RETURNING *
//       `,
//       [messageId, now, userLoggedInId]
//     );
//     res.json(modifyStatus.rows[0])

//   } catch (error) {
//     console.error("Error reporting message", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// Report a message in run messages
app.post("/runs/message/report/", async (req, res) => {
  try {
    const messageId = req.body.messageId;
    const now = new Date();
    const userLoggedInId = req.body.userLoggedInId;

    // Attempt to update existing record
    const updateQuery = `
      UPDATE run_message
      SET status = 'reported', reportedat = $2, reportedby = $3
      WHERE id = $1
      RETURNING *
    `;
    const updateValues = [messageId, now, userLoggedInId];

    // Execute update query
    const updateResult = await pool.query(updateQuery, updateValues);

    // Check if any rows were updated
    if (updateResult.rowCount > 0) {
      res.json(updateResult.rows[0]); // Return updated row
    } else {
      // If no rows were updated, insert new record
      const insertQuery = `
        INSERT INTO run_message (id, reportedat, reportedby, status)
        VALUES ($1, $2, $3, 'reported')
        RETURNING *
      `;
      const insertValues = [messageId, now, userLoggedInId];

      // Execute insert query
      const insertResult = await pool.query(insertQuery, insertValues);
      res.json(insertResult.rows[0]); // Return inserted row
    }

  } catch (error) {
    console.error("Error reporting message", error);
    res.status(500).send("Internal Server Error");
  }
});


//PSQL 9.5
// app.post("/runs/message/report/", async (req, res) => {
//   try {

//     const messageId = req.body.messageId
//     const now = new Date();
//     const userLoggedInId = req.body.userLoggedInId

//     const modifyStatus = await pool.query(
//       `
//       INSERT INTO run_message (id, reportedat, reportedby)
//       VALUES ($1, $2, $3)
//       ON CONFLICT (id)
//       DO UPDATE SET 
//       status = 'reported',
//       reportedat = $2,
//       reportedby = $3
//       RETURNING *
//       `,
//       [messageId, now, userLoggedInId]
//     );
//     res.json(modifyStatus.rows[0])

//   } catch (error) {
//     console.error("Error reporting message", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Flag a message in ride messages
app.post("/rides/message/flag/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Attempt to update existing record
    const updateQuery = `
      UPDATE ride_message
      SET status = 'flagged', reportedat = null
      WHERE id = $1
      RETURNING *
    `;
    const updateValues = [messageId];

    // Execute update query
    const updateResult = await pool.query(updateQuery, updateValues);

    // Check if any rows were updated
    if (updateResult.rowCount > 0) {
      res.json(updateResult.rows[0]); // Return updated row
    } else {
      // If no rows were updated, insert new record
      const insertQuery = `
        INSERT INTO ride_message (id, status)
        VALUES ($1, 'flagged')
        RETURNING *
      `;
      const insertValues = [messageId];

      // Execute insert query
      const insertResult = await pool.query(insertQuery, insertValues);
      res.json(insertResult.rows[0]); // Return inserted row
    }

  } catch (error) {
    console.error("Error flagging message", error);
    res.status(500).send("Internal Server Error");
  }
});


//PSQL 9.5
// app.post("/rides/message/flag/:messageId", async (req, res) => {
//   try {

//     const messageId = req.params.messageId

//     const modifyStatus = await pool.query(
//       `
//       INSERT INTO ride_message (id)
//       VALUES ($1)
//       ON CONFLICT (id)
//       DO UPDATE SET status = 'flagged',
//       reportedat = null
//       RETURNING *
//       `,
//       [messageId]
//     );
//     res.json(modifyStatus.rows[0])

//   } catch (error) {
//     console.error("Error flagging message", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// Flag a message in run messages
app.post("/runs/message/flag/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Attempt to update existing record
    const updateQuery = `
      UPDATE run_message
      SET status = 'flagged', reportedat = null
      WHERE id = $1
      RETURNING *
    `;
    const updateValues = [messageId];

    // Execute update query
    const updateResult = await pool.query(updateQuery, updateValues);

    // Check if any rows were updated
    if (updateResult.rowCount > 0) {
      res.json(updateResult.rows[0]); // Return updated row
    } else {
      // If no rows were updated, insert new record
      const insertQuery = `
        INSERT INTO run_message (id, status, reportedat)
        VALUES ($1, 'flagged', null)
        RETURNING *
      `;
      const insertValues = [messageId];

      // Execute insert query
      const insertResult = await pool.query(insertQuery, insertValues);
      res.json(insertResult.rows[0]); // Return inserted row
    }

  } catch (error) {
    console.error("Error flagging message", error);
    res.status(500).send("Internal Server Error");
  }
});


//PSQL 9.5
// app.post("/runs/message/flag/:messageId", async (req, res) => {
//   try {

//     const messageId = req.params.messageId

//     const modifyStatus = await pool.query(
//       `
//       INSERT INTO run_message (id)
//       VALUES ($1)
//       ON CONFLICT (id)
//       DO UPDATE SET status = 'flagged',
//       reportedat = null
//       RETURNING *
//       `,
//       [messageId]
//     );
//     res.json(modifyStatus.rows[0])

//   } catch (error) {
//     console.error("Error flagging message", error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// Mark a message as OK in ride messages
app.post("/rides/message/ok/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Attempt to update existing record
    const updateQuery = `
      UPDATE ride_message
      SET status = null, reportedat = null
      WHERE id = $1
      RETURNING *
    `;
    const updateValues = [messageId];

    // Execute update query
    const updateResult = await pool.query(updateQuery, updateValues);

    // Check if any rows were updated
    if (updateResult.rowCount > 0) {
      res.json(updateResult.rows[0]); // Return updated row
    } else {
      // If no rows were updated, insert new record
      const insertQuery = `
        INSERT INTO ride_message (id, status, reportedat)
        VALUES ($1, null, null)
        RETURNING *
      `;
      const insertValues = [messageId];

      // Execute insert query
      const insertResult = await pool.query(insertQuery, insertValues);
      res.json(insertResult.rows[0]); // Return inserted row
    }

  } catch (error) {
    console.error("Error marking message as OK", error);
    res.status(500).send("Internal Server Error");
  }
});


//PSQL 9.5
// app.post("/rides/message/ok/:messageId", async (req, res) => {
//   try {

//     const messageId = req.params.messageId

//     const modifyStatus = await pool.query(
//       `
//       INSERT INTO ride_message (id)
//       VALUES ($1)
//       ON CONFLICT (id)
//       DO UPDATE SET status = null,
//       reportedat = null
//       RETURNING *
//       `,
//       [messageId]
//     );
//     res.json(modifyStatus.rows[0])

//   } catch (error) {
//     console.error("Error okying message", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Mark a message as 'ok' in run messages
app.post("/runs/message/ok/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Attempt to update existing record
    const updateQuery = `
      UPDATE run_message
      SET status = null, reportedat = null
      WHERE id = $1
      RETURNING *
    `;
    const updateValues = [messageId];

    // Execute update query
    const updateResult = await pool.query(updateQuery, updateValues);

    // Check if any rows were updated
    if (updateResult.rowCount > 0) {
      res.json(updateResult.rows[0]); // Return updated row
    } else {
      // If no rows were updated, insert new record
      const insertQuery = `
        INSERT INTO run_message (id, status, reportedat)
        VALUES ($1, null, null)
        RETURNING *
      `;
      const insertValues = [messageId];

      // Execute insert query
      const insertResult = await pool.query(insertQuery, insertValues);
      res.json(insertResult.rows[0]); // Return inserted row
    }

  } catch (error) {
    console.error("Error marking message as 'ok'", error);
    res.status(500).send("Internal Server Error");
  }
});

//PSQL 9.5
// app.post("/runs/message/ok/:messageId", async (req, res) => {
//   try {

//     const messageId = req.params.messageId

//     const modifyStatus = await pool.query(
//       `
//       INSERT INTO run_message (id)
//       VALUES ($1)
//       ON CONFLICT (id)
//       DO UPDATE SET status = null,
//       reportedat = null
//       RETURNING *
//       `,
//       [messageId]
//     );

//     res.json(modifyStatus.rows[0])

//   } catch (error) {
//     console.error("Error okying message", error);
//     res.status(500).send("Internal Server Error");
//   }
// });



app.get('/users/messages/read', async (req, res) => {
  let { userForMessages, sender, receiver } = req.query;

  // Convert strings to numbers
  userForMessages = parseInt(req.query.userForMessages);
  userLoggedIn = parseInt(req.query.user.userId);

  try {
    const userMessages = await pool.query(
      `SELECT um.*
      FROM user_messages AS um
      LEFT JOIN followers AS f1 ON um.sender = f1.follower_id AND um.receiver = f1.followee_id AND f1.status = 'accepted'
      LEFT JOIN followers AS f2 ON um.receiver = f2.follower_id AND um.sender = f2.followee_id AND f2.status = 'accepted'
      WHERE (
          (um.sender = $1 AND um.receiver = $2) -- UserForMessages as sender, UserLoggedIn as receiver
          OR
          (um.receiver = $1 AND um.sender = $2) -- UserForMessages as receiver, UserLoggedIn as sender
      )
      AND (
          (f1.follower_id = $1 AND f1.followee_id = $2) -- UserForMessages is follower, UserLoggedIn is followee
          OR
          (f2.follower_id = $1 AND f2.followee_id = $2) -- UserForMessages is followee, UserLoggedIn is follower
      )
      ORDER BY um.date DESC;
      
      `,
      [userForMessages, userLoggedIn]
    );

    res.json(userMessages.rows);
  } catch (err) {
    console.error('Error fetching user messages:', err);
    res.status(500).json({ error: 'An error occurred while fetching user messages' });
  }
});



app.post("/users/messages/send", async (req, res) => {

  const now = new Date();
  const { newMessage, receiver, sender, userLoggedIn } = req.body;

  if (sender === userLoggedIn && newMessage !== "") {
    try {

      const addMessage = await pool.query(
        `
      INSERT INTO user_messages (content, receiver, sender, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
        [newMessage, receiver, sender, now]
      );
      res.json(addMessage.rows[0])

    } catch (error) {
      console.error("Error sending message", error);
      res.status(500).send("Internal Server Error");
    }

  } else {

    res.status(403).json({ error: "Unauthorized access" });
  }
});



//Get pending request users
app.get('/users/loginhistory', async (req, res) => {

  const id = req.query.user.userId

  try {

    const result = await pool.query(`SELECT * FROM login_history WHERE user_id = $1 ORDER BY login_time DESC`, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});



//New follow request notification
app.get('/users/follownotifications', async (req, res) => {

  if (req.query.user) {
    const userId = parseInt(req.query.user)

    try {
      const result = await pool.query(
        `WITH SecondLastLogin AS (
    SELECT user_id, login_time,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_time DESC) AS rn
    FROM login_history
  )
  SELECT DISTINCT f.*
  FROM followers f
  JOIN SecondLastLogin sll ON f.followee_id = sll.user_id
  WHERE f.lastmodification > (
    SELECT MAX(login_time)
    FROM SecondLastLogin
    WHERE user_id = f.followee_id AND rn = 2
  )
  AND f.followee_id = $1
  AND f.status = 'pending'
  `,
        [userId]
      )
      res.json(result.rows)

    } catch (error) {
      console.error('Error fetching login history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(403).json({ error: "Unauthorized access" });

  }
})



//New message notification
app.get('/messages/notifications', async (req, res) => {

  if (req.query && req.query.user) {
    const userId = req.query.user.userId;

    try {
      const result = await pool.query(
        `WITH SecondLastLogin AS (
          SELECT user_id, login_time,
                 ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_time DESC) AS rn
          FROM login_history
        )
        SELECT DISTINCT um.*
        FROM user_messages um
        JOIN SecondLastLogin sll ON um.receiver = sll.user_id
        WHERE um.date > (
          SELECT MAX(login_time)
          FROM SecondLastLogin
          WHERE user_id = um.receiver AND rn = 2
        )
        AND um.receiver = $1;
      `,
        [userId]
      );
      res.json(result.rows);

    } catch (error) {
      console.error('Error fetching message notifications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return
  }

});



//New reported ride message notification
app.get('/messages/reportednotifications', async (req, res) => {

  if (req.query && req.query.user) {
    const userId = req.query.user.userId;

    try {
      const result = await pool.query(
        `WITH SecondLastLogin AS (
          SELECT user_id, login_time,
                 ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_time DESC) AS rn
          FROM login_history
        )
        SELECT DISTINCT rm.*
        FROM ride_message rm
        JOIN SecondLastLogin sll ON rm.createdby = sll.user_id
        WHERE rm.reportedat > (
          SELECT MAX(login_time)
          FROM SecondLastLogin
          WHERE user_id = rm.createdby AND rn = 2
        )
        
      `
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching reported message notifications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return
  }

});



//New reported run message notification
app.get('/messages/reportedrunnotifications', async (req, res) => {

  if (req.query && req.query.user) {
    const userId = req.query.user.userId;

    try {
      const result = await pool.query(
        `WITH SecondLastLogin AS (
          SELECT user_id, login_time,
                 ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_time DESC) AS rn
          FROM login_history
        )
        SELECT DISTINCT rm.*
        FROM run_message rm
        JOIN SecondLastLogin sll ON rm.createdby = sll.user_id
        WHERE rm.reportedat > (
          SELECT MAX(login_time)
          FROM SecondLastLogin
          WHERE user_id = rm.createdby AND rn = 2
        )
        
      `
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching reported run message notifications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return
  }

});



//Get all followers
app.get("/users/followers", async (req, res) => {
  try {
    if (req.query.user) {
      const fetchFollowers = await pool.query(
        `SELECT * FROM followers WHERE followee_id = $1 OR follower_id = $1 ORDER BY lastmodification DESC`,
        [req.query.user.userId]
      );
      res.json(fetchFollowers.rows)
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});




//Get all followees
app.get("/users/followee", async (req, res) => {
  try {

    if (req.query.user) {
      const fetchFollowee = await pool.query(
        `SELECT * FROM followers 
        WHERE follower_id = $1 OR followee_id = $1 ORDER BY lastmodification DESC`,
        [req.query.user.userId]
      );
      res.json(fetchFollowee.rows)
    } else {
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
      res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});


// -------- END ROUTES --------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
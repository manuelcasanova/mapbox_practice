require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials')
const PORT = process.env.PORT || 3500;
const pool = require('./config/db');
const { report } = require('./routes/register');


app.set("view engine", 'ejs');

app.use(express.urlencoded({ extended: false }));

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

// Test route
app.get('/', (req, res) => {
  res.json("Test")
})



///---ROUTES BEFORE JWT TOKEN----

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


///ROUTES AFTER JWT TOKEN----

// app.use(verifyJWT);



// PUT route to update user's last login
app.post('/users/lastlogin/', async (req, res) => {
  try {
    const { userId, lastlogin } = req.body; // Extract userId and lastlogin from request body

    //  console.log(req.body.lastlogin)

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
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});


//Get all users (name only)
app.get("/users/names", async (req, res) => {
  try {
    // console.log("req. query in users/names", req.query)
    // if (req.query.user.accessToken !== undefined) {
    const users = await pool.query(
      'SELECT id, username FROM users ORDER BY username'
      //         `SELECT u.id, u.username 
      //         FROM users u
      //         LEFT JOIN muted m ON (m.mutee = u.id AND m.muter = $1) OR (m.mutee = $1 AND m.muter = u.id)
      //         WHERE m.mute IS NULL OR m.mute = false
      //         ORDER BY u.username
      //         `,
      // [loggedInUserId]
    );
    // console.log("users.rows in users/names", users.rows)
    res.json(users.rows)
    // } else {
    //   // Return an error message indicating unauthorized access
    //   res.status(403).json({ error: "Unauthorized access" });
    // }

  } catch (err) {
    console.error(err.message)
  }
});

//Modify username
app.post("/users/modifyusername", async (req, res) => {
  const { userId, newUsername } = req.body;
  console.log("req.body users/modifyusername", req.body)
  try {
    // Update the username in the database
    await pool.query('UPDATE users SET username = $1 WHERE id = $2', [newUsername, userId]);
    
    // Return success response
    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//Get muted users
app.get('/users/muted', async (req, res) => {
  const userId = req.query.userId;
  // console.log("req.query users/muted", req.query)
  // if (isLoggedIn) {

  try {

    const result = await pool.query('SELECT mutee FROM muted WHERE muter = $1 AND mute = true', [userId]);
    //  const result = await pool.query('SELECT * from muted');
    const mutedUsers = result.rows.map(row => row.mutee);
    res.json({ mutedUsers });
  } catch (error) {
    console.error('Error fetching muted users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  // } else {
  //   // Return an error message indicating unauthorized access
  //   res.status(403).json({ error: "Unauthorized access" });
  // }
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



//Follow a user
app.post("/users/follow", async (req, res) => {
  try {

    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const user = req.body.user;
    const now = new Date();
    // console.log("req.body /users/follow", req.body)
    // console.log("follow date", req.body.date)
    if (req.body.user) {
      // console.log("follow")

      const insertFollowee = await pool.query(
        `
        INSERT INTO followers (follower_id, followee_id, status, lastmodification, newrequest)
        VALUES ($1, $2, 'pending', $3, true)
        ON CONFLICT (follower_id, followee_id)
        DO UPDATE SET status = 'pending' RETURNING *`,
        [followerId, followeeId, now]
      );
      // console.log("inserFolloweerows0", insertFollowee.rows[0])
      res.json(insertFollowee.rows[0])


    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});

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
      // Return an error message indicating unauthorized access
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
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" }); // Handle internal server error
  }
});


//Get pending request users
app.get('/users/pending', async (req, res) => {
  const userId = req.query.userId;
  // console.log("req query /users/pending", req.query)
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
    // Return an error message indicating unauthorized access
    res.status(403).json({ error: "Unauthorized access" });
  }
});


//Approve followee

app.post("/users/approvefollower", async (req, res) => {
  try {

    // console.log("req.body approvefollower", req.body)

    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const user = req.body.user;
    const date = req.body.date || new Date()

    // console.log("approver follower date", date)

    if (req.body.user) {
      const insertFollower = await pool.query(
        `
        INSERT INTO followers (follower_id, followee_id, status, lastmodification)
        VALUES ($1, $2, 'accepted', $3)
        ON CONFLICT (follower_id, followee_id)
        DO UPDATE SET status = 'accepted', lastmodification = $3
        RETURNING *
        `,
        [followeeId, followerId, date]
      );
      res.json(insertFollower.rows[0])



    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});

//Dismiss follow request

app.post("/users/dismissfollower", async (req, res) => {
  try {

    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const user = req.body.user;
    const date = req.body.date || new Date()

    if (req.body.user) {
      const insertFollower = await pool.query(
        `
        INSERT INTO followers (follower_id, followee_id, status, lastmodification)
        VALUES ($1, $2, 'rejected', $3)
        ON CONFLICT (follower_id, followee_id)
        DO UPDATE SET status = 'rejected', lastmodification = $3
        RETURNING *
        `,
        [followeeId, followerId, date]
      );
      res.json(insertFollower.rows[0])



    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});

//Dismiss new message follow request

app.post("/users/dismissmessagefollowrequest", async (req, res) => {
  try {
    //  console.log("req.body dismiss m f r", req.body)
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;


    if (req.body.user) {
      const insertFollower = await pool.query(
        `
        INSERT INTO followers (follower_id, followee_id, newrequest)
        VALUES ($1, $2, false)
        ON CONFLICT (follower_id, followee_id)
        DO UPDATE SET newrequest = false
        RETURNING *
        `,
        [followeeId, followerId]
      );
      res.json(insertFollower.rows[0])



    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});

//Get all followees
app.get("/users/followee", async (req, res) => {
  try {
    // console.log("req.query users/followee", req.query)
    if (req.query.user) {
      // console.log("user id", req.query.user.id)
      const fetchFollowee = await pool.query(
        'SELECT * FROM followers WHERE follower_id = $1 OR followee_id = $1',
        [req.query.user.userId]
      );
      res.json(fetchFollowee.rows)
    } else {
      //  Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});

//Get all followers
app.get("/users/followers", async (req, res) => {
  try {
    // console.log("req.query users/followers", req.query)
    if (req.query.user) {
      //  console.log("req query", req.query)
      const fetchFollowers = await pool.query(
        'SELECT * FROM followers WHERE followee_id = $1 OR follower_id = $1 ORDER BY lastmodification DESC',
        [req.query.user.userId]
      );
      // console.log(fetchFollowers.rows)
      res.json(fetchFollowers.rows)
    } else {
      //  Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});

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
  // console.log("req body", req.body)
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
  // console.log("req", req.params.id)


  let id = req.params.id

  try {
    // const {id} = req.params;
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
  // console.log("req body", req.body)
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
  // console.log("req.body createmap server", req.body)
  try {


    const newMap = await pool.query("INSERT INTO maps (title, createdby, createdAt, mapType) VALUES($1, $2, $3, $4) RETURNING *", [req.body.title, req.body.auth.userId, req.body.createdAt, req.body.mapType]);

    if (newMap.rows.length === 0) {
      return res.status(500).json({ message: "Failed to create map" });
    }

    const insertedMap = newMap.rows[0];
    //  console.log("Inserted map:", insertedMap);
    res.json(insertedMap);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Add user to map
app.post("/maps/adduser", async (req, res) => {
  try {
    // Check if user is logged in
    //  console.log("req.body maps/adduser", req.body)
    if (!req.body.userId) {
      return res.status(401).json({ message: "A user needs to be logged in" });
    }
    // Insert the user to the map_users table
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
    // Check if user ID and map ID are provided
    const userId = req.body.userId;
    const mapId = req.body.mapId;
    // console.log("userId", userId)
    // console.log("mapId", mapId)
    if (!userId || !mapId) {
      return res.status(400).json({ message: "User ID and map ID are required" });
    }

    // Delete the user from the map_users table
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
    // Check if user ID and map ID are provided
    const userId = req.body.userId;
    const rideId = req.body.rideId;
    // console.log("userId", userId)
    // console.log("rideId", rideId)
    if (!userId || !rideId) {
      return res.status(400).json({ message: "User ID and ride ID are required" });
    }

    // Delete the user from the ride_users table
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
    // Check if user ID and map ID are provided
    const userId = req.body.userId;
    const runId = req.body.runId;
    // console.log("userId", userId)
    // console.log("runId", runId)
    if (!userId || !runId) {
      return res.status(400).json({ message: "User ID and run ID are required" });
    }

    // Delete the user from the run_users table
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
    // Check if user is logged in
    // console.log("req.body", req.body)

    // Insert the user to the ride_users table
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
    // Check if user is logged in
    // console.log("req.body", req.body)

    // Insert the user to the ride_users table
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
  // console.log("req.body in /createride", req.body)
  try {
    const { title, distance, speed, date, time, details, mapId, createdAt, dateString, rideType, userId, meetingPoint } = req.body
    const now = new Date();
    // console.log("req.body", req.body)

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
  //  console.log("req.body in /createrun", req.body)
  try {
    const { title, distance, pace, date, time, details, mapId, createdAt, dateString, runType, userId, meetingPoint } = req.body
    const now = new Date();
    // console.log("req.body", req.body)

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

    // console.log(req.params)
    // console.log("req body", req.body)

    // console.log("Deleted map id:", id);

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

    // console.log(req.params)
    // console.log("req body", typeof req.body.data.mapId)
    //console.log("rq body", req.body)

    //  console.log("Deactivated map id:", typeof id);

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
    // console.log(req.body)

    // console.log("Deleted map id:", id);

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
    // console.log(req.body)

    // console.log("Deleted run id:", id);

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
  // console.log("req.body", req.body)
  // console.log("req params", typeof req.params.id)
  try {
    const rideId = Number(req.params.id);
    // console.log("typeof rideid", typeof rideId)
    const userId = req.body.data.userId
    const rideCreatedBy = req.body.data.rideCreatedBy
    const isRideCreatedByUser = req.body.data.isRideCreatedByUser
    const isAdmin = req.body.data.auth.isAdmin

    // console.log(req.params)
    // console.log("req body", typeof req.body.data.mapId)
    //console.log("rq body", req.body)

    //  console.log("Deactivated map id:", typeof id);

    if (isRideCreatedByUser || isAdmin) {

      const deactivatedRide = await pool.query(
        "UPDATE rides SET isactive = false WHERE id = $1 RETURNING *", [rideId]
      )
      // console.log("here")
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
  // console.log("req.body", req.body)
  // console.log("req params", typeof req.params.id)
  try {
    const rideId = Number(req.params.id);
    // console.log("typeof rideid", typeof rideId)
    const userId = req.body.data.userId
    const runCreatedBy = req.body.data.runCreatedBy
    const isRunCreatedByUser = req.body.data.isRunCreatedByUser
    const isAdmin = req.body.data.auth.isAdmin

    // console.log(req.params)
    // console.log("req body", typeof req.body.data.mapId)
    //console.log("rq body", req.body)

    //  console.log("Deactivated run id:", typeof id);

    if (isRunCreatedByUser || isAdmin) {

      const deactivatedRun = await pool.query(
        "UPDATE runs SET isactive = false WHERE id = $1 RETURNING *", [rideId]
      )
      // console.log("here")
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

    const userId = parseInt(req.body.userId);
    const mapId = parseInt(req.body.mapId);
    //     console.log("req. body", req.body)
    // console.log("userid",  userId)
    // console.log("mapId",  mapId)
    if (!userId || !mapId) {
      return res.status(400).json({ message: "User ID and map ID are required" });
    }


    // Delete the user from the map_users table
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

    // Delete the user from the map_users table
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

    // Delete the user from the map_users table
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
    // console.log("req bod", req.body.user)
    // console.log("delete user")

    const userToDeleteIsSuperAdmin = req.body.userObject.issuperadmin;
    // console.log(userToDeleteIsSuperAdmin)

    if (req.body.loggedInUser.isSuperAdmin && !userToDeleteIsSuperAdmin) {


      // const deleteUsers = 
      await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *", [req.body.user]
      )
      res.json("The user was deleted")

      // res.json(deleteFollowRequest.rows[0])

    } else {
      res.json("Users can only be deleted by Super Admins")
    }

  } catch (err) {
    console.error(err.message)
  }
})

//Activate a user
app.post("/user/activate/:id", async (req, res) => {
  try {
    // console.log(req.body)
    const isLoggedIn = req.body.data.isUserLoggedIn
    const userId = req.body.data.userId



    if (isLoggedIn) {


      const activateUser = await pool.query(
        "UPDATE users SET isactive = true, email = REPLACE(email, 'inactive-', '') WHERE id = $1 RETURNING *", [userId]
      )
      res.json(activateUser.rows[0])
      // console.log("res.json", activateUser.rows[0])

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
    // console.log(req.body)
    const isLoggedIn = req.body.data.isUserLoggedIn
    const userId = req.body.data.userId

    if (isLoggedIn) {


      const deactivateUser = await pool.query(
        "UPDATE users SET isactive = false, email = CONCAT('inactive-', email) WHERE id = $1 RETURNING *", [userId]
      )
      res.json(deactivateUser.rows[0])
      // console.log("res.json", deactivateUser.rows[0])

    } else {
      res.json("User can only be deactivated by user if logged in")
    }

  } catch (err) {
    console.error(err.message)
  }
})

//Get all public maps 

app.get("/maps/public", async (req, res) => {
  try {

    const userId = req.query.userId;
    // console.log("req query", req)
    // console.log("userId serverjs", userId)
    const maps = await pool.query(

      `
      SELECT DISTINCT m.* 
      FROM maps m
      LEFT JOIN followers f ON m.createdBy = f.followee_id
      LEFT JOIN muted mute1 ON mute1.muter = $1 AND mute1.mutee = m.createdBy
      LEFT JOIN muted mute2 ON mute2.muter = m.createdBy AND mute2.mutee = $1
      INNER JOIN users u1 ON m.createdBy = u1.id
      INNER JOIN users u2 ON $1 = u2.id
      WHERE (m.mapType = 'public' OR (m.mapType = 'followers' AND f.follower_id = $1))
      AND (mute1.mute IS NULL OR mute1.mute = false)
AND (mute2.mute IS NULL OR mute2.mute = false)
AND m.isactive = true
AND u1.isActive = true
    AND u2.isActive = true
      ORDER BY m.id DESC
      
    `, [userId]


    );
    // console.log("maps. rows", maps.rows)
    res.json(maps.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get maps from user
app.get("/maps/", async (req, res) => {
  try {

    const userId = req.query.userId;
    // console.log("req query", req.query)
    // console.log("userId serverjs", userId)
    const maps = await pool.query(
      //User's maps only
      //'SELECT * FROM maps WHERE createdby = $1 ORDER BY id DESC', [userId]
      //User's maps and user in maps
      'SELECT * FROM maps WHERE createdby = $1 AND isactive = true UNION SELECT maps.* FROM maps INNER JOIN map_users ON maps.id = map_users.map_id WHERE map_users.user_id = $1 AND maps.isactive = true ORDER BY id DESC',
      [userId]

    );
    res.json(maps.rows)
    //console.log("maps.rows", maps.rows)
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
    // console.log("maps", maps.rows)
    res.json(maps.rows)
    // console.log("maps.rows", maps.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get rides with other users
app.get("/rides/otherusers", async (req, res) => {
  // console.log("req.query in rides/otherusers", req.query)
  try {

    // const userId = req.query.userId;
    const rides = await pool.query(
      'SELECT * FROM ride_users'
    );
    // console.log("rides.rows", rides.rows)
    res.json(rides.rows)
    // console.log("maps.rows", rides.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get runs with other users
app.get("/runs/otherusers", async (req, res) => {
  // console.log("req.query in runs/otherusers", req.query)
  try {

    // const userId = req.query.userId;
    const runs = await pool.query(
      'SELECT * FROM run_users'
    );
    // console.log("runs.rows", runs.rows)
    res.json(runs.rows)
    // console.log("maps.rows", runs.rows)
  } catch (err) {
    console.error(err.message)
  }
});



//Get maps from other users, if they are public and we added them to "our maps"

app.get("/maps/shared", async (req, res) => {
  // console.log("req.query in maps/shared", req.query)
  try {
    const userId = req.query.userId;

    // Query to retrieve maps associated with the user through map_users
    const mapsQuery = `
      SELECT m.*
      FROM maps m
      JOIN map_users mu ON m.id = mu.map_id
      WHERE mu.user_id = $1
      
      UNION
      
      SELECT m.*
      FROM maps m
      WHERE m.createdby = $1
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

    if (req.query.user && req.query.user.isAdmin) {
      const rides = await pool.query(
        'SELECT * FROM rides'
      );
      res.json(rides.rows)
    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});


//Get all runs (admin)
app.get("/runs", async (req, res) => {
  try {

    if (req.query.user && req.query.user.isAdmin) {
      const runs = await pool.query(
        'SELECT * FROM runs'
      );
      res.json(runs.rows)
    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});


//Get all public rides (user)
app.get("/rides/public", async (req, res) => {
  try {

    //  console.log("req.query on rides/public", req.query)

    if (req.query.user && req.query.user.accessToken) {

      const userId = req.query.user.userId
      //  console.log("req. query", req.query.user)


      if (req.query.filteredRides) {
        //  console.log("req.query", req.query.filteredRides)


        const dateStart = req.query.filteredRides.dateStart
        const dateEnd = req.query.filteredRides.dateEnd
        const distanceMin = req.query.filteredRides.distanceMin
        const distanceMax = req.query.filteredRides.distanceMax
        const speedRangeMin = req.query.filteredRides.speedMin
        const speedRangeMax = req.query.filteredRides.speedMax

        // console.log(
        // dateStart, dateEnd, distanceMin, distanceMax, speedRangeMin, speedRangeMax)

        // Construct the SQL query with parameters

        // AND starting_date >= $1
        //  AND starting_date <= $2

        const ridesQuery = `
     SELECT DISTINCT r.*
     FROM rides r
     LEFT JOIN followers f ON r.createdby = f.followee_id
     LEFT JOIN muted mute1 ON mute1.muter = $7 AND mute1.mutee = r.createdby
     LEFT JOIN muted mute2 ON mute2.muter = r.createdby AND mute2.mutee = $7
     INNER JOIN users u1 ON r.createdby = u1.id
     INNER JOIN users u2 ON $7 = u2.id
     WHERE (r.ridetype='public' OR (r.ridetype = 'followers' and f.follower_id = $7))
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
   `



        // Execute the query with parameters
        const rides = await pool.query(ridesQuery, [
          dateStart, dateEnd,
          distanceMin, distanceMax, speedRangeMin, speedRangeMax, userId]);
          // console.log("rides.rows YES filtered rides", rides.rows)
        res.json(rides.rows)

      } else {
        // console.log("No filtered rides")

        // If there are no filtering parameters provided, return all public rides
        // const rides = await pool.query(`
        // SELECT * FROM rides WHERE ridetype='public'
        // `);


        const rides = await pool.query(`
        SELECT DISTINCT r.* 
        FROM rides r
        LEFT JOIN followers f ON r.createdby = f.followee_id
        WHERE (r.ridetype='public' OR (r.ridetype = 'followers' and f.follower_id = $1))
        `, [userId]);


        //    `SELECT DISTINCT m.* 
        //    FROM maps m
        //    LEFT JOIN followers f ON m.createdBy = f.followee_id
        //    WHERE (m.mapType = 'public' OR (m.mapType = 'followers' AND f.follower_id = $1))
        //    ORDER BY m.id DESC

        //  `, [userId]
        //  console.log("rides.rows no filtered rides", rides.rows)
        res.json(rides.rows);
      }

    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }


  } catch (err) {
    console.error(err.message)
  }
});

//Get all public runs (user)
app.get("/runs/public", async (req, res) => {
  try {

    //  console.log("req.query on runs/public", req.query)

    if (req.query.user && req.query.user.accessToken) {

      const userId = req.query.user.userId
      
      //  console.log("req. query", req.query.user)


      if (req.query.filteredRuns) {
        // console.log("req.query", req.query.filteredRides)


        const dateStart = req.query.filteredRuns.dateStart
        const dateEnd = req.query.filteredRuns.dateEnd
        const distanceMin = req.query.filteredRuns.distanceMin
        const distanceMax = req.query.filteredRuns.distanceMax
        const paceRangeMin = req.query.filteredRuns.paceMin
        const paceRangeMax = req.query.filteredRuns.paceMax

        const runsQuery = `
     SELECT DISTINCT r.*
     FROM runs r
     LEFT JOIN followers f ON r.createdby = f.followee_id
     LEFT JOIN muted mute1 ON mute1.muter = $7 AND mute1.mutee = r.createdby
     LEFT JOIN muted mute2 ON mute2.muter = r.createdby AND mute2.mutee = $7
     INNER JOIN users u1 ON r.createdby = u1.id
     INNER JOIN users u2 ON $7 = u2.id
     WHERE (r.runtype='public' OR (r.runtype = 'followers' and f.follower_id = $7))
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
   `;

        // Execute the query with parameters
        const runs = await pool.query(runsQuery, [
          dateStart, dateEnd,
          distanceMin, distanceMax, paceRangeMin, paceRangeMax, userId]);
        res.json(runs.rows)

      } else {

        const runs = await pool.query(`
        SELECT DISTINCT r.* 
        FROM runs r
        LEFT JOIN followers f ON r.createdby = f.followee_id
        WHERE (r.runtype='public' OR (r.runtype = 'followers' and f.follower_id = $1))
        `, [userId]);

        res.json(runs.rows);
      }

    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }


  } catch (err) {
    console.error(err.message)
  }
});

//Get users rides
app.get("/rides/user/:id", async (req, res) => {

  // console.log("req.query.filtered rides", req.query.filteredRides)

  try {
    const { id } = req.params;
    const dateStart = req.query.filteredRides.dateStart
    const dateEnd = req.query.filteredRides.dateEnd
    const distanceMin = req.query.filteredRides.distanceMin
    const distanceMax = req.query.filteredRides.distanceMax
    const speedRangeMin = req.query.filteredRides.speedMin
    const speedRangeMax = req.query.filteredRides.speedMax


    // Check if id is null or undefined
    if (id === null || id === undefined) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const rides = await pool.query(
      // 'SELECT * FROM rides where createdby = $1 ORDER BY createdAt DESC, starting_date desc, starting_time DESC'
      'SELECT * FROM rides WHERE createdby = $1 AND starting_date >= $2 AND starting_date <= $3 AND distance >= $4  AND distance <= $5 AND speed >= $6 AND speed <= $7 AND isactive = true UNION SELECT rides.* FROM rides INNER JOIN ride_users ON rides.id = ride_users.ride_id WHERE ride_users.user_id = $1 AND starting_date >= $2 AND starting_date <= $3 AND distance >= $4 AND distance <= $5 AND speed >= $6 AND speed <= $7 ORDER BY id DESC'

      , [id, dateStart, dateEnd, distanceMin, distanceMax, speedRangeMin, speedRangeMax]
    );
    // console.log("rides rows", rides.rows)
    res.json(rides.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Get users runs
app.get("/runs/user/:id", async (req, res) => {

  //  console.log("req.query.filtered rides", req.query.filteredRuns)

  try {
    const { id } = req.params;
    const dateStart = req.query.filteredRuns.dateStart
    const dateEnd = req.query.filteredRuns.dateEnd
    const distanceMin = req.query.filteredRuns.distanceMin
    const distanceMax = req.query.filteredRuns.distanceMax
    const paceRangeMin = req.query.filteredRuns.paceMin
    const paceRangeMax = req.query.filteredRuns.paceMax


    // Check if id is null or undefined
    if (id === null || id === undefined) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const runs = await pool.query(
      // 'SELECT * FROM rides where createdby = $1 ORDER BY createdAt DESC, starting_date desc, starting_time DESC'
      'SELECT * FROM runs WHERE createdby = $1 AND starting_date >= $2 AND starting_date <= $3 AND distance >= $4  AND distance <= $5 AND pace >= $6 AND pace <= $7 AND isactive = true UNION SELECT runs.* FROM runs INNER JOIN run_users ON runs.id = run_users.run_id WHERE run_users.user_id = $1 AND starting_date >= $2 AND starting_date <= $3 AND distance >= $4 AND distance <= $5 AND pace >= $6 AND pace <= $7 ORDER BY id DESC'

      , [id, dateStart, dateEnd, distanceMin, distanceMax, paceRangeMin, paceRangeMax]
    );
    // console.log("runs rows", runs.rows)
    res.json(runs.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/rides/messages', async (req, res) => {
  // console.log("req.query in rides/messages", req.query)
  const { ride_id } = req.query;
  //  console.log("ride_id", ride_id)
  try {
    const rideMessages = await pool.query('SELECT * FROM ride_message WHERE ride_id = $1 ORDER BY createdat DESC', [ride_id]);
    // console.log(rideMessages.rows)
    res.json(rideMessages.rows);

  } catch (err) {
    console.error('Error fetching ride messages:', err);
    res.status(500).json({ error: 'An error occurred while fetching ride messages' });
  }
});

app.get('/runs/messages', async (req, res) => {
  // console.log("req.query in runs/messages", req.query)
  const { run_id } = req.query;
  //  console.log("ride_id", ride_id)
  try {
    const runMessages = await pool.query('SELECT * FROM run_message WHERE run_id = $1 ORDER BY createdat DESC', [run_id]);
    // console.log(rideMessages.rows)
    res.json(runMessages.rows);

  } catch (err) {
    console.error('Error fetching ride messages:', err);
    res.status(500).json({ error: 'An error occurred while fetching run messages' });
  }
});

app.get("/rides/messages/reported", async (req, res) => {
  const isAdmin = req.query.isAdmin;
// console.log("isAdmin", isAdmin)
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin permission required.' });
  } else {
    try {
      const reportedMessages = await pool.query(`SELECT * from ride_message WHERE status = 'reported'`);
      // console.log(reportedMessages.rows)
      res.json(reportedMessages.rows)
    } catch (err) {
      console.error('Error fetching ride messages:', err);
      res.status(500).json({ error: 'An error occurred while fetching ride messages' });
    }
  }
});

app.get("/rides/messages/flagged", async (req, res) => {
  const isAdmin = req.query.isAdmin;
// console.log("isAdmin", isAdmin)
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin permission required.' });
  } else {
    try {
      const flaggedMessages = await pool.query(`SELECT * from ride_message WHERE status = 'flagged'`);
      // console.log(flaggedMessages.rows)
      res.json(flaggedMessages.rows)
    } catch (err) {
      console.error('Error fetching ride messages:', err);
      res.status(500).json({ error: 'An error occurred while fetching ride messages' });
    }
  }
});

app.get("/runs/messages/reported", async (req, res) => {
  const isAdmin = req.query.isAdmin;
// console.log("isAdmin", isAdmin)
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin permission required.' });
  } else {
    try {
      const reportedMessages = await pool.query(`SELECT * from run_message WHERE status = 'reported'`);
      // console.log(reportedMessages.rows)
      res.json(reportedMessages.rows)
    } catch (err) {
      console.error('Error fetching run messages:', err);
      res.status(500).json({ error: 'An error occurred while fetching run messages' });
    }
  }
});


app.get("/runs/messages/flagged", async (req, res) => {
  const isAdmin = req.query.isAdmin;
// console.log("isAdmin", isAdmin)
  if (isAdmin !== 'true') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin permission required.' });
  } else {
    try {
      const flaggedMessages = await pool.query(`SELECT * from run_message WHERE status = 'flagged'`);
      //  console.log(flaggedMessages.rows)
      res.json(flaggedMessages.rows)
    } catch (err) {
      console.error('Error fetching run messages:', err);
      res.status(500).json({ error: 'An error occurred while fetching run messages' });
    }
  }
});

app.post("/rides/addmessage", async (req, res) => {
  // console.log(req.body)
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

      // console.log(insertedMessage.rows); // Logging the inserted message

      res.status(201).json({ message: "Message added successfully", data: insertedMessage.rows });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "An error occurred while adding the message" });
    }
  } else {
    // Return an error message indicating unauthorized access
    res.status(403).json({ error: "Unauthorized access" });
  }
});

app.post("/runs/addmessage", async (req, res) => {
  // console.log(req.body)
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

      // console.log(insertedMessage.rows); // Logging the inserted message

      res.status(201).json({ message: "Message added successfully", data: insertedMessage.rows });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "An error occurred while adding the message" });
    }
  } else {
    // Return an error message indicating unauthorized access
    res.status(403).json({ error: "Unauthorized access" });
  }
});



app.post("/rides/message/delete/:messageId", async (req, res) => {

  try {

    // console.log("req.params", req.params)

    const messageId = req.params.messageId

    const modifyStatus = await pool.query(
      `
      INSERT INTO ride_message (id)
      VALUES ($1)
      ON CONFLICT (id)
      DO UPDATE SET status = 'deleted'
      RETURNING *
      `,
      [messageId]
    );
    res.json(modifyStatus.rows[0])

  } catch (error) {
    console.error("Error deleting message", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/runs/message/delete/:messageId", async (req, res) => {

  try {

    // console.log("req.params", req.params)

    const messageId = req.params.messageId

    const modifyStatus = await pool.query(
      `
      INSERT INTO run_message (id)
      VALUES ($1)
      ON CONFLICT (id)
      DO UPDATE SET status = 'deleted'
      RETURNING *
      `,
      [messageId]
    );
    res.json(modifyStatus.rows[0])

  } catch (error) {
    console.error("Error deleting message", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/rides/message/report/", async (req, res) => {
  try {


    const messageId = req.body.messageId
    const now = new Date();
    // console.log("now", now) 
    // let localTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    // console.log("local time", localTime)
    const userLoggedInId = req.body.userLoggedInId

    const modifyStatus = await pool.query(
      `
      INSERT INTO ride_message (id, reportedat, reportedby)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE SET 
      status = 'reported',
      reportedat = $2,
      reportedby = $3
      RETURNING *
      `,
      [messageId, now, userLoggedInId]
    );
    res.json(modifyStatus.rows[0])

  } catch (error) {
    console.error("Error reporting message", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/runs/message/report/", async (req, res) => {
  try {


    const messageId = req.body.messageId
    const now = new Date();
    // console.log("now", now) 
    // let localTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    // console.log("local time", localTime)
    const userLoggedInId = req.body.userLoggedInId

    const modifyStatus = await pool.query(
      `
      INSERT INTO run_message (id, reportedat, reportedby)
      VALUES ($1, $2, $3)
      ON CONFLICT (id)
      DO UPDATE SET 
      status = 'reported',
      reportedat = $2,
      reportedby = $3
      RETURNING *
      `,
      [messageId, now, userLoggedInId]
    );
    res.json(modifyStatus.rows[0])

  } catch (error) {
    console.error("Error reporting message", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/rides/message/flag/:messageId", async (req, res) => {
  try {

    // console.log("req.params", req.params)

    const messageId = req.params.messageId

    const modifyStatus = await pool.query(
      `
      INSERT INTO ride_message (id)
      VALUES ($1)
      ON CONFLICT (id)
      DO UPDATE SET status = 'flagged',
      reportedat = null
      RETURNING *
      `,
      [messageId]
    );
    res.json(modifyStatus.rows[0])

  } catch (error) {
    console.error("Error flagging message", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/runs/message/flag/:messageId", async (req, res) => {
  try {

    // console.log("req.params", req.params)

    const messageId = req.params.messageId

    const modifyStatus = await pool.query(
      `
      INSERT INTO run_message (id)
      VALUES ($1)
      ON CONFLICT (id)
      DO UPDATE SET status = 'flagged',
      reportedat = null
      RETURNING *
      `,
      [messageId]
    );
    res.json(modifyStatus.rows[0])

  } catch (error) {
    console.error("Error flagging message", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/rides/message/ok/:messageId", async (req, res) => {
  try {

    // console.log("req.params", req.params)

    const messageId = req.params.messageId

    const modifyStatus = await pool.query(
      `
      INSERT INTO ride_message (id)
      VALUES ($1)
      ON CONFLICT (id)
      DO UPDATE SET status = null,
      reportedat = null
      RETURNING *
      `,
      [messageId]
    );
    res.json(modifyStatus.rows[0])

  } catch (error) {
    console.error("Error okying message", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/runs/message/ok/:messageId", async (req, res) => {
  try {

    // console.log("req.params", req.params)

    const messageId = req.params.messageId

    const modifyStatus = await pool.query(
      `
      INSERT INTO run_message (id)
      VALUES ($1)
      ON CONFLICT (id)
      DO UPDATE SET status = null,
      reportedat = null
      RETURNING *
      `,
      [messageId]
    );
    res.json(modifyStatus.rows[0])

  } catch (error) {
    console.error("Error okying message", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get('/users/messages/read', async (req, res) => {
  let { userForMessages, sender, receiver } = req.query;

  //console.log("req.query", req.query)
  // console.log("req.query.userForMessages", req.query.userForMessages)
  // console.log("req.query user logged in Id", req.query.user.id)

  // Convert strings to numbers
  userForMessages = parseInt(req.query.userForMessages);
  userLoggedIn = parseInt(req.query.user.userId);

  // console.log(userForMessages, userLoggedIn)

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
    // console.log(userMessages.rows);
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

      //  console.log("req.body back users/messages/send", req.body)


      // console.log("Backend x 4:", newMessage, receiver, sender, isLoggedIn)

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
    // Return an error message indicating unauthorized access
    res.status(403).json({ error: "Unauthorized access" });
  }
});

//Get pending request users
app.get('/users/loginhistory', async (req, res) => {

  //  console.log("/loginhistory", req.query.user)
  //1522 HERE
  const id = req.query.user.userId

  //  console.log("backend", id, loggedIn, username)

  // if (loggedIn) {

  try {

    const result = await pool.query(`SELECT * FROM login_history WHERE user_id = $1 ORDER BY login_time DESC`, [id]);
    // console.log("rd", result)
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  // } else {
  //   // Return an error message indicating unauthorized access
  //   res.status(403).json({ error: "Unauthorized access" });
  // }
});

//New follow request notification

app.get('/users/follownotifications', async (req, res) => {

  // console.log("req.query in follow not", req.query.user)
  if (req.query.user) {
    // console.log("req.query.user ", req.query.user)
    const userId = parseInt(req.query.user)
    // console.log("typeof userId", typeof userId)
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
      //  console.log("result.rows /users/follownot ", result.rows)
    } catch (error) {
      console.error('Error fetching login history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Return an error message indicating unauthorized access
    res.status(403).json({ error: "Unauthorized access" });

  }
})

//New message notification
app.get('/messages/notifications', async (req, res) => {

  // console.log("req.query in messages/notifications", req.query)
  if (req.query && req.query.user) {
    const userId = req.query.user.userId;
    // console.log("userId in /mes/not", userId);

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
      //  console.log(result.rows);
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

  // console.log("req.query in messages/reportednotifications", req.query)
  if (req.query && req.query.user) {
    const userId = req.query.user.userId;
    // console.log("userId in /mes/not", userId);

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
      //  console.log(result.rows);
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

  // console.log("req.query in messages/reportednotifications", req.query)
  if (req.query && req.query.user) {
    const userId = req.query.user.userId;
    // console.log("userId in /mes/not", userId);

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
      //  console.log(result.rows);
    } catch (error) {
      console.error('Error fetching reported run message notifications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return
  }

});

// -------- END ROUTES --------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
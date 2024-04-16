require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;
const pool = require('./config/db');


app.set("view engine", 'ejs');

app.use(express.urlencoded({ extended: false }));

// Cross Origin Resource Sharing
app.use(cors());

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

const loggedInUserId = req.query.user.id

    if (req.query.user && req.query.user.loggedIn) {
      const users = await pool.query(
        // 'SELECT id, username FROM users ORDER BY username'
                `SELECT u.id, u.username 
                FROM users u
                LEFT JOIN muted m ON (m.mutee = u.id AND m.muter = $1) OR (m.mutee = $1 AND m.muter = u.id)
                WHERE m.mute IS NULL OR m.mute = false
                ORDER BY u.username
                `,
        [loggedInUserId]
      );
      res.json(users.rows)
    } else {
      // Return an error message indicating unauthorized access
      res.status(403).json({ error: "Unauthorized access" });
    }

  } catch (err) {
    console.error(err.message)
  }
});

//Get muted users
app.get('/users/muted', async (req, res) => {
  const userId = req.query.userId;
  const isLoggedIn = req.query.isLoggedIn

  if (isLoggedIn) {

    try {

      const result = await pool.query('SELECT mutee FROM muted WHERE muter = $1 AND mute = true', [userId]);
      //  const result = await pool.query('SELECT * from muted');
      const mutedUsers = result.rows.map(row => row.mutee);
      res.json({ mutedUsers });
    } catch (error) {
      console.error('Error fetching muted users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Return an error message indicating unauthorized access
    res.status(403).json({ error: "Unauthorized access" });
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



//Follow a user
app.post("/users/follow", async (req, res) => {
  try {

    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const user = req.body.user;
    // console.log("req body", req.body)
    if (req.body.user && req.body.user.loggedIn) {
      // console.log("follow")

      const insertFollowee = await pool.query(
        `
        INSERT INTO followers (follower_id, followee_id, status)
        VALUES ($1, $2, 'pending')
        ON CONFLICT (follower_id, followee_id)
        DO UPDATE SET status = 'accepted' RETURNING *`,
        [followerId, followeeId]
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

//Unfollow a user


app.post("/users/unfollow", async (req, res) => {
  try {
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const user = req.body.user;

    if (req.body.user && req.body.user.loggedIn) {
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


//Approve followee

app.post("/users/approvefollower", async (req, res) => {
  try {

    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    const user = req.body.user;
    // console.log(req.body)

    if (req.body.user && req.body.user.loggedIn) {

      const insertFollower = await pool.query(
        `
        INSERT INTO followers (follower_id, followee_id, status)
        VALUES ($1, $2, 'accepted')
        ON CONFLICT (follower_id, followee_id)
        DO UPDATE SET status = 'accepted'
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

    if (req.query.user && req.query.user.loggedIn) {
      // console.log("user id", req.query.user.id)
      const fetchFollowee = await pool.query(
        'SELECT * FROM followers WHERE follower_id = $1 OR followee_id = $1',
        [req.query.user.id]
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

    if (req.query.user && req.query.user.loggedIn) {
      // console.log("user id", req.query.user.id)
      const fetchFollowers = await pool.query(
        'SELECT * FROM followers WHERE followee_id = $1 OR follower_id = $1',
        [req.query.user.id]
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
  try {
    let lat = req.body.coords[0];
    let lng = req.body.coords[1];
    let mapId = req.body.mapId;

    const newPoint = await pool.query(
      'INSERT INTO points (lat, lng, map) VALUES ($1, $2, $3)  RETURNING *', [lat, lng, mapId]
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
    // Check if user is logged in
    if (!req.body.user || !req.body.user.loggedIn) {
      return res.status(401).json({ message: "A user needs to be logged in to create a map" });
    }

    const newMap = await pool.query("INSERT INTO maps (title, createdby, createdAt, mapType) VALUES($1, $2, $3, $4) RETURNING *", [req.body.title, req.body.user.id, req.body.createdAt, req.body.mapType]);

    if (newMap.rows.length === 0) {
      return res.status(500).json({ message: "Failed to create map" });
    }

    const insertedMap = newMap.rows[0];
    // console.log("Inserted map:", insertedMap);
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
    // console.log("req.body", req.body)
    if (!req.body.userId || !req.body.userIsLoggedIn) {
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

//Add user to ride
app.post("/rides/adduser", async (req, res) => {
  try {
    // Check if user is logged in
    //  console.log("req.body", req.body)
    if (!req.body.userId || !req.body.userIsLoggedIn) {
      return res.status(401).json({ message: "A user needs to be logged in" });
    }
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



//Create a ride
app.post("/createride", async (req, res) => {
  try {
    const { title, distance, speed, date, time, details, mapId, createdAt, dateString, rideType, userId, meetingPoint } = req.body

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

    const newRide = await pool.query(`INSERT INTO rides (name, distance, speed, createdat, map, starting_date, starting_time, ridetype, createdBy, details, meeting_point) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [title, distance, speed, createdAt, mapId, psqlDate, time, rideType, userId, details, meetingPoint])
    res.json(newRide.rows[0])
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

//Delete a ride
app.delete("/ride/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.body.userId
    const rideCreatedBy = req.body.rideCreatedBy

    // console.log("Deleted map id:", id);

    if (userId === rideCreatedBy) {

      await pool.query(
        "DELETE FROM rides WHERE id = $1 RETURNING *", [id]
      )
      res.json("The ride was deleted")

    } else {
      res.json("Ride can only be deleted by creator")
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


/*
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

*/


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
      WHERE (m.mapType = 'public' OR (m.mapType = 'followers' AND f.follower_id = $1))
      AND (mute1.mute IS NULL OR mute1.mute = false)
AND (mute2.mute IS NULL OR mute2.mute = false)
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
      'SELECT * FROM maps WHERE createdby = $1 UNION SELECT maps.* FROM maps INNER JOIN map_users ON maps.id = map_users.map_id WHERE map_users.user_id = $1 ORDER BY id DESC',
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
  try {

    const userId = req.query.userId;
    const rides = await pool.query(
      'SELECT * FROM ride_users'
    );
    // console.log("maps", rides.rows)
    res.json(rides.rows)
    // console.log("maps.rows", rides.rows)
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


//Get all public rides (user)
app.get("/rides/public", async (req, res) => {
  try {

    if (req.query.user && req.query.user.loggedIn) {

      const userId = req.query.user.id
      //  console.log("req. query", req.query.user)

      if (req.query.filteredRides) {
        // console.log("req.query", req.query.filteredRides)

        const dateStart = req.query.filteredRides.dateStart
        const dateEnd = req.query.filteredRides.dateEnd
        const distanceMin = req.query.filteredRides.distanceMin
        const distanceMax = req.query.filteredRides.distanceMax
        const speedRangeMin = req.query.filteredRides.speedMin
        const speedRangeMax = req.query.filteredRides.speedMax

        // console.log(
        // dateRangeStart, dateRangeEnd, 
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
     WHERE (r.ridetype='public' OR (r.ridetype = 'followers' and f.follower_id = $7))
     AND starting_date >= $1
     AND starting_date <= $2
       AND distance >= $3
       AND distance <= $4
       AND speed >= $5
       AND speed <= $6
       AND (mute1.mute IS NULL OR mute1.mute = false)
       AND (mute2.mute IS NULL OR mute2.mute = false)
   `;

   

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
        // console.log("rides.rows no filtered rides", rides.rows)
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
      'SELECT * FROM rides WHERE createdby = $1 AND starting_date >= $2 AND starting_date <= $3 AND distance >= $4  AND distance <= $5 AND speed >= $6 AND speed <= $7 UNION SELECT rides.* FROM rides INNER JOIN ride_users ON rides.id = ride_users.ride_id WHERE ride_users.user_id = $1 AND starting_date >= $2 AND starting_date <= $3 AND distance >= $4 AND distance <= $5 AND speed >= $6 AND speed <= $7 ORDER BY id DESC'

      , [id, dateStart, dateEnd, distanceMin, distanceMax, speedRangeMin, speedRangeMax]
    );
    // console.log("rides rows", rides.rows)
    res.json(rides.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// -------- END ROUTES --------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
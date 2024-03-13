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

    const newMap = await pool.query("INSERT INTO maps (title, createdby, createdAt, isPrivate) VALUES($1, $2, $3, $4) RETURNING *", [req.body.title, req.body.user.id, req.body.createdAt, req.body.privateMap]);

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



//Create a ride
app.post("/createride", async (req, res) => {
  try {
    const { title, distance, speed, date, time, details, mapId, createdAt, dateString, privateRide, userId, meetingPoint } = req.body

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

    const newRide = await pool.query(`INSERT INTO rides (name, distance, speed, createdat, map, starting_date, starting_time, isprivate, createdBy, details, meeting_point) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [title, distance, speed, createdAt, mapId, psqlDate, time, privateRide, userId, details, meetingPoint])
    res.json(newRide.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

//Delete a map
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("Deleted map id:", id);
    await pool.query(
      "DELETE FROM maps WHERE id = $1 RETURNING *", [id]
    )
    res.json("The map was deleted")
  } catch (err) {
    console.error(err.message)
  }
})

//Get all maps 

//Get maps from user
app.get("/maps", async (req, res) => {
  try {

    const userId = req.query.userId;
    // console.log("req query", req)
    //  console.log("userId serverjs", userId)
    const maps = await pool.query(
      'SELECT * FROM maps WHERE createdby = $1 ORDER BY id DESC', [userId]
    );
    res.json(maps.rows)
  } catch (err) {
    console.error(err.message)
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
      const rides = await pool.query(
        'SELECT * FROM rides WHERE isprivate = false'
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

//Get users rides
app.get("/rides/user/:id", async (req, res) => {

  try {
    const { id } = req.params;

    // Check if id is null or undefined
    if (id === null || id === undefined) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const rides = await pool.query(
      'SELECT * FROM rides where createdby = $1 ORDER BY createdAt DESC, starting_date desc, starting_time DESC', [id]
    );
    res.json(rides.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// -------- END ROUTES --------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
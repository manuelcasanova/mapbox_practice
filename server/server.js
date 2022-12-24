require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;
const pool = require('./config/db')

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
  try {
    const points = await pool.query(
      'SELECT lat, lng FROM points'
    );
    res.json(points.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get points from one map
app.get("/points/:id", async (req, res) => {
  try {
    const {id} = req.params;
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
  try {
    let lat = req.body.coords[0];
    let lng = req.body.coords[1];
    const newPoint = await pool.query(
      'INSERT INTO points (lat, lng, map) VALUES ($1, $2, $3)  RETURNING *', [lat, lng, 1]
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
app.post("/points/delete/all", async (req, res) => {

  try {

   await pool.query(
     "DELETE FROM points"
   )
   res.json("Network Response: All points were deleted")
  } catch (err) {
    console.error(err.message)
  }
})

//Get all maps
app.get("/maps", async (req, res) => {
  try {
    const maps = await pool.query(
      'SELECT * FROM maps'
    );
    res.json(maps.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Get one map
app.get("/maps/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const maps = await pool.query(
      'SELECT * FROM maps WHERE id = $1', [id]
    );
    res.json(maps.rows)
  } catch (err) {
    console.error(err.message)
  }
});

// -------- END ROUTES --------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
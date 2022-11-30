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

//Create a point
app.post("/points", async (req, res) => {
  try {
    let lat = req.body.coords[0];
    let lng = req.body.coords[1];
    const newPoint = await pool.query(
      'INSERT INTO points (lat, lng) VALUES ($1, $2) RETURNING *', [lat, lng]
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


// -------- END ROUTES --------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
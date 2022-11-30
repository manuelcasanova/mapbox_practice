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
      'SELECT * FROM points'
    );
    res.json(points.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//Create a point
app.post("/points", async (req, res) => {
  try {
    const { coords } = req.body
    const latitude = coords[0]
    const longitude = coords[1]

    // console.log("coords", coords, longitude, latitude)

    const newPoint = await pool.query(
      'INSERT INTO points (latitude, longitude) VALUES ($1, $2) RETURNING *', [latitude, longitude]
    );
    res.json(newPoint.rows[0])
  } catch (err) {
    console.error(err.message)
  }
});


// -------- END ROUTES --------

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
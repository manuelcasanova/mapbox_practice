// BASIC SERVER WORKING ON CPANEL


require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3500;
const cookieParser = require('cookie-parser');
// const credentials = require('./middleware/credentials')
const verifyJWT = require('./middleware/verifyJWT');
const pool = require('./config/db');
// const bcrypt = require('bcrypt')

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


app.set("view engine", 'ejs');

app.use('/profile_pictures', express.static(path.join(__dirname, '/profile_pictures')));

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
// app.use(credentials);

// Enable CORS with wildcard (*)
app.use(cors());
// app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser())


// -------- START ROUTES --------


// Example route
app.get('/', (req, res) => {
  res.send('Test 4');
});


///---ROUTES BEFORE JWT TOKEN----

// app.use('/register', require('./routes/register'));
// app.use('/auth', require('./routes/auth'));
// app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
// app.use('/forgot-password', require('./routes/forgot-password'));


// app.use(verifyJWT);



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



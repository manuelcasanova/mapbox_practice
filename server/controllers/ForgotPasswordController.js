const pool = require('../config/db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');


const BASE_URL = process.env.REMOTE_CLIENT_APP;

const handlePost = async (req, res) => {
  const { email } = req.body;

  try {
    const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const oldUser = data.rows;

    if (oldUser.length === 0) {
      return res.sendStatus(403); // User not found
    }

    const secret = process.env.ACCESS_TOKEN_SECRET + oldUser[0].password;
    const token = jwt.sign({ email: oldUser[0].email, id: oldUser[0].id }, secret, { expiresIn: '15m' });
    const link = `${BASE_URL}/forgot-password/${oldUser[0].id}/${token}`;

    let transporter = nodemailer.createTransport({
      host: process.env.RESET_EMAIL_CLIENT,
      port: process.env.RESET_EMAIL_PORT,
      auth: {
        user: process.env.RESET_EMAIL,
        pass: process.env.RESET_PASSWORD
      }
    });

    let mailOptions = {
      from: process.env.RESET_EMAIL,
      to: email,
      subject: 'PASSWORD RESET RWITHME.COM',
      text: `This link is valid for 15 minutes. Follow the instructions to enter a valid password: ${link}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
        return res.json({ status: 'Failed to send password reset email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ status: 'Password reset email sent successfully' });
      }
    });

  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ status: 'Something went wrong' });
  }
};


const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const handlePostVerified = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    if (password === "") {
      return res.json({ status: 'Field cannot be empty' });
    }

    if (!PWD_REGEX.test(password)) {
      return res.json({ status: 'Password must be 8 to 24 characters long and include uppercase, lowercase letters, a number, and a special character (! @ # $)' });
    }

    const data = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const oldUser = data.rows[0];

    if (!oldUser) {
      return res.json({ status: 'User not found' });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET + oldUser.password;

    try {
      const verifyJWT = jwt.verify(token, secret);
      const hashedPwd = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hashedPwd, id]);

      res.render("index", { email: verifyJWT.email, status: "Password updated" });

    } catch (err) {
      console.error('Error verifying token:', err);
      res.json({ status: 'Token verification failed' });
    }

  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ status: 'Something went wrong' });
  }
};


const handleGet = async (req, res) => {
  const { id, token } = req.params;

  try {
    const data = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const oldUser = data.rows[0];

    if (!oldUser) {
      return res.json({ status: 'User not found' });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET + oldUser.password;

    try {
      const verifyJWT = jwt.verify(token, secret);
      res.render("index", { email: verifyJWT.email, status: "Verified" });

    } catch (err) {
      console.error('Error verifying token-2:', err);
      res.json({ status: `Token verification failed-2 /// id${id} token${token}`});
    }

  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ status: 'Something went wrong' });
  }
};


module.exports = {
  handlePost,
  handleGet,
  handlePostVerified
}
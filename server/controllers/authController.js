const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { pwd, trimmedEmail } = req.body;

    // Set a timeout for the request (e.g., 10 seconds)
    const TIMEOUT_DURATION = 3000; // 3 seconds

    // Set a flag to track if the request has already been handled
    let requestHandled = false;

    // Set a timeout to handle the case where the backend does not respond
    const timeoutId = setTimeout(() => {
        if (!requestHandled) {
            // If the request has not been handled, respond with a timeout error
            requestHandled = true;
            res.status(504).json({ error: "Request timed out" });
        }
    }, TIMEOUT_DURATION);

    try {
        // Check if email and password are provided
        if (!pwd || !trimmedEmail) {
            clearTimeout(timeoutId);
            requestHandled = true;
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Fetch user from the database
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [trimmedEmail]);
        if (rows.length === 0) {
            clearTimeout(timeoutId);
            requestHandled = true;
            return res.status(400).json({ error: "No user registered" });
        }

        const user = rows[0];
// console.log("user", user)
        // Compare provided password with stored hash
        const passwordMatch = await bcrypt.compare(pwd, user.password);
        if (!passwordMatch) {
            clearTimeout(timeoutId);
            requestHandled = true;
            return res.status(401).json({ error: "Incorrect password" });
        }

        const { id, username, isadmin, issuperadmin, email, isactive, profile_picture } = user;
        const loggedIn = !!id;

        // console.log(profile_picture)

        // Create JWTs
        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });

        // Update user with new refresh token
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

        // Clear the timeout since the request has been handled successfully
        clearTimeout(timeoutId);
        requestHandled = true;

        // Send response
        res.json({
            id,
            loggedIn,
            username,
            isAdmin: isadmin,
            isSuperAdmin: issuperadmin,
            isActive: isactive,
            email,
            accessToken,
            profile_picture
        });

    } catch (error) {
        // Clear the timeout if it hasn't already been cleared
        if (!requestHandled) {
            clearTimeout(timeoutId);
            requestHandled = true;
        }
        // Log error and send server error response
        console.error("Error during login:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { handleLogin };

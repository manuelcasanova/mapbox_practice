const bcrypt = require('bcrypt');
const pool = require('../config/db')
// const { response } = require('express');



const handleNewUser = async (req, res) => {

    const { user, pwd, email } = req.body;


    if (!user || !pwd || !email) return res.status(400).json({ 'message': 'Username, email and password are required.' });

     //encrypt the password
     const hashedPwd = await bcrypt.hash(pwd, 10);

    let duplicate = false;

try {
    pool.query('SELECT * FROM users WHERE email = $1 AND isactive = true', [email], (error, results) => {
        // console.log(results.rows.length)
        if (results.rows.length > 0) {
            duplicate = true
        }
        if (duplicate) return res.sendStatus(409); //Conflict 

        try {
   

            pool.query(
                'INSERT INTO users (username, email, password, profile_picture) VALUES ($1, $2, $3, $4) RETURNING id',
                [user, email, hashedPwd, 'profile_pictures/x/profile_picture.jpg'],
                (error, results) => {
                    if (error) {
                        // Handle error
                        console.error('Error inserting user:', error);
                    } else {
                        const userId = results.rows[0].id;
                        const profilePicturePath = `profile_pictures/${userId}/profile_picture.jpg`;
            
                        // Update the user's profile picture path with the dynamically generated path
                        pool.query(
                            'UPDATE users SET profile_picture = $1 WHERE id = $2',
                            [profilePicturePath, userId],
                            (updateError, updateResults) => {
                                if (updateError) {
                                    // Handle update error
                                    console.error('Error updating profile picture path:', updateError);
                                } else {
                                    console.log('User inserted and profile picture path updated successfully');
                                }
                            }
                        );
                    }
                }
            );

   

    res.status(201).json({ 'success': `New user ${user} created!` });
} catch (err) {
    res.status(500).json({ 'message': err.message });
}

    });
} catch (err) {
    console.log(err)
}



}

module.exports = { handleNewUser };


Login/logout


-------------

Study structure server.js (casinosteps)

const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

//Template to create html js in node
app.set("view engine", 'ejs');

const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.urlencoded({extended: false}));

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use('/register', require('./routes/register')); ----------> controllers/registerController
app.use('/auth', require('./routes/auth')); ----------> controllers/authController
app.use('/refresh', require('./routes/refresh')); ----------> controllers/refreshTokenController
app.use('/logout', require('./routes/logout')); ----------> controllers/logoutController
app.use('/forgot-password', require('./routes/forgot-password')); ----------> controllers/forgotPasswordController


app.use(verifyJWT);

After this, I believe, routes that require being logged in.

After routes, before app.listen

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

-------------

OAuth

localhost:3500 (.env)
Organize backend like in casinosteps.ca

Modify username
Modify password

MOVE ALL FUNCTIONS TO UTIL/FUNCTIONS

Change <div> top <> where appropiate

Remove logs and unused dependencies

Fix eslint errors

<!-- CSS AND ORGANIZATION: -->

Navbar: MAPS (see my maps, see public mas), RIdes (see my rides, see public rides). search (athletes, rides, maps). RIGHT --> login/logout, notifications (private messages, messages on rides)

LEFT MAIN: Picture, Name, Following, Followers, Rides created, Rides joined

CENTER MAIN: Next rides

RIGHT MAIN: TOP: Following (order by how many rides) BELOW: Not following (order by how many rides)

Show notifications above everything else on the right if open them

<!-- /CSS AND ORGANIZATION  -->


PRODUCTION

Future:

Possibility of receving email when:
message notifications
someone joins a ride
someone writes a message in your ride

sign up. Receive an email so not anyone can sign up for you


DONE

When deactivate user, modify the email to be inactive-email@email.com. When activating, modify the email to be again email@email.com. This way, there would not be conflict if the user wants to sign up again with the same email.

Users deactivate from users admin

Users: delete definitively by superadmin if not superadmin themselves

do not show maps/rides if user isactive false

Delete own account (deactivate in database)

Show user profile

"Ready to seize the day? Run with me or ride with me?". Welcome component


Delete maps and definitively by superAdmin

Maps, rides: if deleted only isActive = false

CONFIRM DELETE: Delete map, delete ride

Ride messages only if user joined ride

Message notifications 

Follow request notifications. Show in General Notifications

Personal messaging between followers (start with refresh, then move to websocket)
Write message

See messages in "My rides"

Rides - discussion. Messages (from: name and picture, date and time, comment. ADD a comment, delete a comment)

Rides: Messages - Report messages (status -reported. Inform admin. Admin can modifiy to status: ok or inappropiate)
Rides: Messages - Delete my messages (do not delete from db. status -deleted)
Rides: Messages - Mark as innapropiate (do not delete from db, status -inappropiate - show message in frontend. Removed for inappopiate language)


Rides: Messages - Read messages
Rides: Messages - Add messages

Detect touch screen or not and display title accordingly

On Follow request: Show how long ago "Less than 1 day" or 1, 2, 3 days, etc. 

In pending: Order by date requested, new on top

Dismiss each follow request notification

Dismiss request follow

People who joined a ride: "Joined by, x people" info button show list, how many privately, names and pictures of following publicly

Logo orange rwithme ("un" or "ide" between "r" and with in grey?)

Pending requests

Cancel request to follow

Mute/unmute, follow/unfollow from Followers and following

Show a component with muted users, and allow to unmute.

If muted, user cannot find other user in list.

See public maps if user not muted by user

See public rides if user not muted by user

Functions:

FOLLOW
UNFOLLOW
MUTE
UNMUTE

Create map/ride Who can see it? Dropdown instead of three checkboxes


Create ride: Followers option

In "See maps" show also "followee's maps"

Rides and maps: Only me, followers, public

rwithme.com register

If ride is in the past. Show a note. 

Logic to filter rides my rides

Button to clear filters

Logic to filter rides on rides/public

Add a message, this ride has no map. The map might have been deleted by the owner.

Show hoy many riders joined a ride

Join a ride (privately or not)

Add rides created by other user to my rides if I'm following them

Implement logic and backend logic to remove from my maps from "manage my maps"

If a MAP is deleted, RIDE is deleted. Let's not delete ride, just have it without map

Delete button for map only if user.id = map.createdby
Functions:

MOVE ALL FUNCTIONS TO UTIL/FUNCTIONS

Show a component with muted users, and allow to unmute.

Mute/unmute, follow/unfollow from Followers and following

USERS page with 4 subpages

MAIN PAGE: FOLLOW, REQUEST PENDING, FOLLOWING, MUTE/UNMUTE
FOLLOWING: UNFOLLOW
FOLLOWERS: MUTE (do not allow the to see your "followers rides/maps". Do not see theirs). They are still your followers, though.
MUTED: Show all muted users. Button/logic: UNMUTE

Show list: Friends, Pending, All

People who joined a ride: "Joined by, x people" info button show list, how many privately, names and pictures of following publicly

Rides - discussion. Messages (from: name and picture, date and time, comment. ADD a comment, delete a comment)

Administrator: admin users, admin maps, admin rides, admin comments. If inappropiate. do not delete, keep in db, but do not show on front end, but a note "message removed due to..."

Ride messaging

Personal messaging between followers


Follow request notifications

Message notifications

Possibility of receving email when:
message notifications
someone joins a ride
someone writes a message in your ride

Login/logout

OAuth

Navbar: MAPS (see my maps, see public mas), RIdes (see my rides, see public rides). search (athletes, rides, maps). RIGHT --> login/logout, notifications (private messages, messages on rides)

LEFT MAIN: Picture, Name, Following, Followers, Rides created, Rides joined

CENTER MAIN: Next rides

RIGHT MAIN: TOP: Following (order by how many rides) BELOW: Not following (order by how many rides)

Logo orange rwithme ("un" or "ide" between "r" and with in grey?)


DONE

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
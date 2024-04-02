/users/followers
only get the rows if the user is either the follower or followee, but not the rest.

Follow pending, following, unfollow, follow back:

Idea:

Friendships psql table (user1_id, user2_id, status: notconnected (default) pending, accepted, declined, blocked). 

When a user sends a connection request, modify status to pending. Once accepted, modify to accepted.

If blocked, user cannot find other user in list. Give option to unblock (update to default status notconnected)

Show list: Friends, Pending, All

See public maps/rides if user not blocked by user!

Rides and maps: Only me, followers, public

People who joined a ride: "Joined by, x people" info button show list, how many privately, names and pictures of following publicly

Rides - discussion. Messages (from: name and picture, date and time, comment. ADD a comment, delete a comment)

Administrator: admin users, admin maps, admin rides, admin comments. If inappropiate. do not delete, keep in db, but do not show on front end, but a note "message removed due to..."

Login/logout

OAuth

Navbar: MAPS (see my maps, see public mas), RIdes (see my rides, see public rides). search (athletes, rides, maps). RIGHT --> login/logout, notifications (private messages, messages on rides)

LEFT MAIN: Picture, Name, Following, Followers, Rides created, Rides joined

CENTER MAIN: Next rides

RIGHT MAIN: TOP: Following (order by how many rides) BELOW: Not following (order by how many rides)

Logo orange rwithme ("un" or "ide" between "r" and with in grey?)


DONE

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
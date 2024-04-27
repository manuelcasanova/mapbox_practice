

Message notifications 

CONFIRM DELETE: Delete map, delete ride

Possibility of receving email when:
message notifications
someone joins a ride
someone writes a message in your ride

Login/logout

OAuth

MOVE ALL FUNCTIONS TO UTIL/FUNCTIONS

Change <div> top <> where appropiate

Remove logs and unused dependencies

Fix eslint errors

Navbar: MAPS (see my maps, see public mas), RIdes (see my rides, see public rides). search (athletes, rides, maps). RIGHT --> login/logout, notifications (private messages, messages on rides)

LEFT MAIN: Picture, Name, Following, Followers, Rides created, Rides joined

CENTER MAIN: Next rides

RIGHT MAIN: TOP: Following (order by how many rides) BELOW: Not following (order by how many rides)


DONE


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
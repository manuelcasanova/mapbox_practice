
<div>Icons made from <a href="https://www.onlinewebfonts.com/icon">svg icons</a>is licensed by CC BY 4.0</div>


Check if muted maps, rides, runs, user in all users, user in following, user in follower should not be visible.

if no filtered rides or runs, consider muted as well. THE ISSUE WITH PUblIC RUNS SEEMS TO BE RELATED TO FILTER. No filtered RUNS. check for muted if no filtered runs as well



Conversation in rides and runs. logged in user on right, rest on left

Functionalities

My account -  modify picture
Delete personal message - Just inactivate and show "deleted message"


Admin rides/runs, be able to search by ride/run ID as an admin
Search users (no muted)
Search maps (by user, by name. no muted)



client/.env

REACT_APP_API_URL=http://localhost:3500

FIX: on persist login when reload, auth is fixed, but rideApp is undefined. If I set default state to true. Ok to show rides. But no when click on filter.

Next:

OAuth

Organize backend like in casinosteps.ca


MOVE ALL FUNCTIONS TO UTIL/FUNCTIONS


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

logic for read/unread messages

Possibility of receving email when:
message notifications
someone joins a ride
someone writes a message in your ride

sign up. Receive an email so not anyone can sign up for you


DONE

Modify password

Forgot password

Modify username

Admin / See flagged messages (no need for notification - can approve) 

- Messages reported by

- Admin runs

notifications new run message reported

- Reported messages - include run messages

- Ride messages: Modify date/time format

 Ride messages by username instead of id

From create a map go to reate a new run or ride




- superadmin change users to isAdmin, or user

Show notifications for new reported messages (for admins)

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
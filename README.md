# discordstuffv2
new version of my bot incorporating Discord's [native Events functionality](https://support.discord.com/hc/en-us/articles/4409494125719-Scheduled-Events)

Github: https://github.com/aaroncthompson/discordstuffv2

## What it does
When users create an Event in Discord, a Discord bot running this code will automatically do the following:
1. Create a role named after the Scheduled Events's unique ID,
2. Create a private text channel named after the Event's start date and name allowing only users with that role to see or post in that channel,
3. Ping the Scheduled Event's creator in that private text channel,
4. Post a notification regarding the Event to a text channel that users can interact with, and
5. Save information regarding the Scheduled Event ID, text channel ID, and role ID to a JSON datastore.

When users click "Interested" in the Event, the bot will assign them the role, and when users interact again with the Event to mark that they are no longer interested, the bot will remove the role.

When the Scheduled Event ends (`GuildScheduledEventStatus.Completed`), all users with the role will be individually added to the text channel and the role will be deleted to minimize its footprint with respect to Discord's hard limit of 250 roles per server. The Scheduled Event's creator will remain untouched. Information regarding the Scheduled Event will be removed from the datastore - the Scheduled Event is considered to no longer be managed by the bot and the bot will never interact with the associated channel again. This does mean users will no longer be able to gain or give up access to the channel via self-service - if the Scheduled Event's creator still has access (ie they did not remove the role from themselves prior to the Scheduled Event's conclusion), they can add/remove them.

Note that Discord has additional hard limits at 500 channels and 100 Scheduled Events. If channel creation fails for any reason, the bot should gracefully move on while logging the message `Failed to handle new event creation for (${eventId}):` and the error message (`err`). As these channels will often contain important data such as photos and conversations, I recommend implementing your own long-term strategy to ensure such things are not lost. As of this writing, Discord retains this data indefinitely, but external links (eg to uploaded images) automatically expire after 14 days. There are no authorization or authentication mechanisms in place for such links - anyone with the link regardless of their status as an attendee, server member, or even Discord user can view images that members link to externally. Please ensure that your users are informed.

In a prior version, the bot would detect changes to the Scheduled Event and update the channel accordingly - however, due to Discord's [limitations on channel renaming](https://support.discord.com/hc/en-us/community/posts/20757990318999-Increase-renaming-channel-API), I have removed this functionality - consideration was made with regards to introduction of retry logic in conjunction with detection of further Scheduled Event edits as well as any manual channel name changes, but I believe the layer of complexity this would introduce would negatively impact user experience.

Anyone seeking to make use of this code should be aware of three hardcoded values which must be changed:
1. Your bot's token in .env,
2. The category under which private channels are created in (see `channel.parent` in events/guildScheduledEventCreate.js), and
3. The ID of the channel to which notification posts are made in (see `announcementChannel` in events/guildScheduledEventCreate.js).

## Less technical explanation for your event planners
Click on the Events button at the top left (look for a little calendar icon), click "Create Event", and complete the form. The following will automatically happen:
* Your event will be added to the Events list - you can right-click it to add it to a calendar app, edit it, and cancel (delete) it.
* A text channel (group chat) will be created for the event, where you'll be pinged - you have complete control over this channel, including the ability to rename or delete it (cancelling an event will also automatically delete its channel). A link to this channel will be automatically added to your event's description, and any edits to the channel name will be automatically reflected in this link.
* The event will be posted to #⁠rsvp - potential attendees can click "Interested" either here or via the same Events button you used. Any edits to the event will be automatically reflected in this post.

When the event ends, everyone who had access before will keep access, but the Event will be removed from the Events list. The post in #rsvp will update to show that the event is over and it will no longer be possible to "attend" it, but you can always add/invite new people yourself.

## Planned features
* Upload the `events/` directory that actually enables the described functionality
  * **Blocker**: my code is really embarassing
* Servers moving from my last iteration of this solution ([newdiscordstuff](https://github.com/aaroncthompson/newdiscordstuff)) or running both simultaneously such as during a transition period (the bots are perfectly happy to do their own thing without stepping on each others' toes ad infinitum, but the same might not be true for your users!) may be suffering from role bloat. To address this, I am planning on introducing functions to:
  1. **WILL DO** - Identify (**how?**) roles created by bots running "newdiscordstuff" and delete any that are not explicitly listed within the permissions sets of any currently existing text channels. I am intentionally choosing not to have this functionality limit itself to evaluating text channels created by "newdiscordstuff" as a "fail open" just in case these roles have been re-used somewhere else - this solution is a sledgehammer and we should be confident that it'll only remove roles that are unambiguously no longer of any use. Would probably also be a good idea to save the member lists for these roles as a cautionary measure enabling two-way door traversal - the cost of retaining this data even if it's ultimately unneeded would be negligible.
     * **Blocker**: logic for identifying these roles - their names were all generated via `Math.floor(Math.random() * 1000000)`, but.. it's not like nobody else was allowed to create roles with random numbers; less relevant if we have the function just report them instead of deleting them so administrators can apply their own layer of "does this number actually mean something" before acting on the roles themselves.
  2. **MIGHT DO** - Allow administrators to ad-hoc apply the "role → role-having users" `GuildScheduledEventStatus.Completed` logic mentioned above to specific channels, perhaps via a slash command such as `/roletousers`. I do not plan on importing / preserving the "react role" functionality of "newdiscordstuff", mainly because it'd require users to provide administrators with start/end times - I believe it'd be best to avoid confusing users by keeping the solutions' mechanisms - at least at the user end - entirely separate. If I do this, I might as well go the extra mile and have this function edit the event's announcement channel post to reflect that the event is over and remove the reacts.
     * **Blocker**: the finite and inexorable nature of time

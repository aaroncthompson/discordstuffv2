# discordstuffv2
new version of my bot incorporating Discord's [native Events functionality](https://support.discord.com/hc/en-us/articles/4409494125719-Scheduled-Events)

Github: https://github.com/aaroncthompson/discordstuffv2

## What it does
When users create an Event in Discord, my bot will automatically do the following:
1. Create a role named after the Event's unique ID,
2. Create a private text channel named after the Event's start date and name allowing only users with that role to see or post in that channel,
3. Ping the Event's creator in that private text channel,
4. Post a notification regarding the Event to a text channel that users can interact with, and
5. Save information regarding the Event ID, text channel ID, and role ID to a JSON datastore.

When users click "Interested" in the Event, the bot will assign them the role, and when users interact again with the Event to mark that they are no longer interested, the bot will remove the role.

When the Event ends, all users with the role will be individually added to the text channel and the role will be deleted to avoid Discord's hard limit of 250 roles per server. The Event's creator will remain untouched. Information regarding the Event will be removed from the datastore - the Event is considered to no longer be managed by the bot. This does mean users will no longer be able to gain or give up access to the channel via self-service - if the Event's creator still has access (ie they did not remove the role from themselves prior to the Event's conclusion), they can add/remove them.

Note that Discord has additional hard limits at 500 channels and 100 Events. If channel creation fails for any reason, the bot will output to the console an error with `Failed to handle new event creation for (${eventId}):` and `err`.

In a prior version, the bot would detect changes to the Event and update the channel accordingly - however, due to Discord's [limitations on channel renaming](https://support.discord.com/hc/en-us/community/posts/20757990318999-Increase-renaming-channel-API), I have removed this functionality - consideration was made with regards to introduction of retry logic in conjunction with detection of further Event changes as well as any manual channel name changes, but I believe the layer of complexity this would introduce would negatively impact user experience.

Anyone seeking to make use of this bot should be aware of three hardcoded values:
1. Your bot's token in .env,
2. The category under which private channels are created in (see `channel.parent` in events/guildScheduledEventCreate.js), and
3. The ID of the channel to which notification posts are made in (see `announcementChannel` in events/guildScheduledEventCreate.js).

## Less technical explanation for your event planners
Click on the Events button at the top left (look for a little calendar icon), click "Create Event", and complete the form. The following will automatically happen:
* Your event will be added to the Events list - you can right-click it to add it to a calendar app, edit it, and cancel (delete) it.
* A text channel (group chat) will automatically be created for the event where you'll be pinged - you have complete control over this channel, including the ability to rename or delete it (cancelling an event will also automatically delete its channel). A link to this channel will also be added to your event's description - any edits to the channel name will be reflected in this link.
* The event will be posted to #⁠rsvp - potential attendees can click "Interested" either here or via the same Events button you used. Any edits to the event will be reflected in this post.

When the event ends, everyone who had access before will keep access, but the Event will be removed from the Events list. The post in #rsvp will update to show that the event is over and it will no longer be possible to "attend" it.

# discordstuffv2
new version of my bot incorporating Discord's native Events functionality
https://github.com/aaroncthompson/discordstuffv2

## What it does
When users create an Event in Discord, my bot will automatically do the following:
1. Create a role named after the Event's unique ID,
2. Create a private text channel named after the Event's start date and name allowing only users with that role to see or post in that channel,
3. Ping the Event's creator in that private text channel,
4. Post a notification regarding the Event to a text channel that users can interact with, and
5. Save information regarding the Event ID, text channel ID, and role ID to a JSON datastore.

When users click "Interested" in the Event, the bot will assign them the role, and when users interact again with the Event to mark that they are no longer interested, the bot will remove the role.

When the Event ends, all users with the role will be individually added to the text channel, the role will be deleted, and information regarding the Event will be removed from the datastore.

In a prior version, the bot would detect changes to the Event and update the channel accordingly - however, due to Discord's limitations on channel renaming, this functionality was removed.

Anyone seeking to make use of this bot should be aware of two hardcoded values:
1. The category under which private channels are created in (see `channel.parent` in events/guildScheduledEventCreate.js), and
2. The ID of the channel to which notification posts are made in (see `announcementChannel` in events/guildScheduledEventCreate.js).

const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const discordfunctions = require('../functions/discordfunctions.js');

module.exports = {
    name: 'pfp',
    description: 'Fetches a users pfp and sends the image',
    users: [],
    servers: [],
    syntax: '&pfp <@user or id>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const member = message.mentions.users.first();
        if (member) {
            return messages.send_reply(firedb, message, member.avatarURL());
        } else {
            const user = await discordfunctions.GetUser(client, args[0]);
            if (!user) {
                return messages.send_reply(
                    firedb,
                    message,
                    'Error fetching profile picture. Make sure the user id is correct.'
                );
            } else {
                return messages.send_reply(firedb, message, user.avatarURL());
            }
        }
    },
};

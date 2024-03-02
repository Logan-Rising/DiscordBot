const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');

module.exports = {
    name: 'pfp',
    description: 'Fetches a users pfp and sends the image',
    users: [],
    servers: [],
    syntax: '&pfp <@user>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const member = message.mentions.users.first();
        if (member) {
            messages.send_reply(firedb, message, member.avatarURL());
        } else {
            messages.send_reply(firedb, message, 'Error fetching profile picture');
        }
    },
};

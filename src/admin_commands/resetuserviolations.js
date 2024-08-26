const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');
const discordfunctions = require('../functions/discordfunctions.js');

module.exports = {
    name: 'resetuserviolations',
    description: 'Reset the user\' filter violations back to zero',
    users: [],
    servers: [],
    syntax: '&resetuserviolations',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const member = message.mentions.users.first();
        if (member) {
            return await databasefunctions.SetUserFilterViolations(firedb, message.guild.id, member.id, 0);
        } else {
            const user = await discordfunctions.GetUser(client, firedb, args[0]);
            if (!user) {
                return messages.send_reply(
                    firedb,
                    message,
                    'Error fetching user. Make sure the user id is correct.'
                );
            } else {
                return await databasefunctions.SetUserFilterViolations(firedb, message.guild.id, user.id, 0);
            }
        }

        return;
    },
};

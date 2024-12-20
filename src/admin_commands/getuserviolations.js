const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');
const discordfunctions = require('../functions/discordfunctions.js');

module.exports = {
    name: 'getuserviolations',
    description: 'Get a user\'s current number of filter violations',
    users: ['admin'],
    servers: [],
    syntax: '&getuserviolations <@user or id>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const member = message.mentions.users.first();
        if (member) {
            return messages.send_reply(
                firedb,
                message,
                `<@${member.id}> has ` +
                    (await databasefunctions.GetUserViolations(firedb, message.guild.id, member.id)) +
                    ` violations`
            );
        } else {
            const user = await discordfunctions.GetUser(client, firedb, args[0]);
            if (!user) {
                return messages.send_reply(firedb, message, 'Error fetching user. Make sure the user id is correct.');
            } else {
                return messages.send_reply(
                    firedb,
                    message,
                    `<@${user.id}> has ` +
                        (await databasefunctions.GetUserViolations(firedb, message.guild.id, user.id)) +
                        ` violations`
                );
            }
        }

        return;
    },
};

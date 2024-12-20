const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');
const discordfunctions = require('../functions/discordfunctions.js');

module.exports = {
    name: 'setuserviolations',
    description: 'Set the number of violations for a user',
    users: ['admin'],
    servers: [],
    syntax: '&setuserviolations <@user or user id> <number>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const num = parseInt(args[1]);

        if (isNaN(num)) {
            return messages.send_reply(
                firedb,
                message,
                'Make sure second argument is a number. Syntax is : ' + this.syntax
            );
        }

        const member = message.mentions.users.first();
        if (member) {
            return await databasefunctions.SetUserFilterViolations(firedb, message.guild.id, member.id, num);
        } else {
            const user = await discordfunctions.GetUser(client, firedb, args[0]);
            if (!user) {
                return messages.send_reply(firedb, message, 'Error fetching user. Make sure the user id is correct.');
            } else {
                return await databasefunctions.SetUserFilterViolations(firedb, message.guild.id, user.id, num);
            }
        }
    },
};

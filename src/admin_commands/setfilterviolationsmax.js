const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'setfilterviolationsmax',
    description: 'Set the violations limit before punishment is enforced',
    users: [],
    servers: [],
    syntax: '&setfilterviolationsmax <number>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const num = parseInt(args[0]);

        if (isNaN(num)) {
            return messages.send_reply(
                firedb,
                message,
                'Make sure your argument is a number. Syntax is : ' + this.syntax
            );
        }

        await databasefunctions.SetUserViolationsMax(firedb, message.guild.id, num);

        return;
    },
};

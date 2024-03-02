const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');

module.exports = {
    name: 'getcommandusage',
    description: "Get a command database element' usage statistic",
    users: [constants.ownerId],
    servers: [],
    syntax: '&getcommandusage <command name>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementIndex(firedb, 1, 'commands', this.name);

        const count = await databasefunctions.GetIndex(firedb, 'commands', args[0]);

        if (count === -1) {
            messages.send_reply(firedb, message, 'Databse command element does not exist');
        } else {
            messages.send_reply(firedb, message, count);
        }
    },
};

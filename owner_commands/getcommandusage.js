const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'getcommandusage',
    description: "Get a command database element' usage statistic",
    users: [constants.ownerId],
    servers: [],
    syntax: '&getcommandusage <command name>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const count = await databasefunctions.GetCommandCount(args[0], firedb);

        if (count === -1) {
            messages.send_reply(firedb, message, 'Databse command element does not exist');
        } else {
            messages.send_reply(firedb, message, count);
        }
    },
};

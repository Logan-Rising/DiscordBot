const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'getcommandusage',
    description: 'Get a command database element\' usage statistic',
    users: [constants.ownerId],
    servers: [],
    syntax: '&getcommandusage <command name>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const count = await firebasefunctions.GetCommandCount(args[0], firedb);

        if (count === -1) {
            messages.send_reply(message, 'Databse command element does not exist');
        } else {
            messages.send_reply(message, count);
        }
    },
};

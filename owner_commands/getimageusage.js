const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'getimageusage',
    description: 'Get an image database element\' usage statistic',
    users: [constants.ownerId],
    servers: [],
    syntax: '&getimageusage <command name>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const count = await firebasefunctions.GetImageUsage(args[0], firedb);

        if (count === -1) {
            messages.send_reply(message, 'Databse image element does not exist');
        } else {
            messages.send_reply(message, count);
        }
    },
};

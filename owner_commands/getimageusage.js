const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');

module.exports = {
    name: 'getimageusage',
    description: "Get an image database element' usage statistic",
    users: [constants.ownerId],
    servers: [],
    syntax: '&getimageusage <command name>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const count = await databasefunctions.GetImageUsage(args[0], firedb);

        if (count === -1) {
            messages.send_reply(firedb, message, 'Databse image element does not exist');
        } else {
            messages.send_reply(firedb, message, count);
        }
    },
};

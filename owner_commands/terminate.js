/* Windows Only */

const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');

module.exports = {
    name: 'terminate',
    description: 'Terminate the discord bot process',
    users: [constants.ownerId],
    servers: [],
    syntax: '&terminate',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementIndex(firedb, 1, 'commands', this.name);

        if (process.platform === 'win32') process.exit(1);
        else return;
    },
};

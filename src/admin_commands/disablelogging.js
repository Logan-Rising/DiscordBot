const databasefunctions = require('../functions/databasefunctions.js');

module.exports = {
    name: 'disablelogging',
    description: 'Disable logging for the current server',
    users: ['admin'],
    servers: [],
    syntax: '&disablelogging',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        await databasefunctions.SetLogChannel(firedb, message.guildId, '');

        return;
    },
};

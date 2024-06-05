const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');
const constants = require('../constants/constants.js');

module.exports = {
    name: 'syncserverdatabase',
    description: '',
    users: [constants.ownerId],
    servers: [],
    syntax: '&syncserverdatabase',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        await databasefunctions.SyncCachedServerSettings(firedb);

        return await messages.send_reply(firedb, message, 'Synced cache server info and cloud server info');
    },
};

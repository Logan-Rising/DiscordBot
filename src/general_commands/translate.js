const databasefunctions = require('../functions/databasefunctions.js');

module.exports = {
    name: 'translate',
    description: '',
    users: [],
    servers: [],
    syntax: '&translate',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        return;
    },
};

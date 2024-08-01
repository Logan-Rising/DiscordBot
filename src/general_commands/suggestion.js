const fs = require('fs');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../assets/config.js');
const logging = require('../functions/logging.js');

module.exports = {
    name: 'suggestion',
    description: 'Submits a suggestion for the bot to be added/removed/changed',
    users: [],
    servers: [],
    syntax: '&suggestion <request>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

        let message_string = '';

        for (var i = 0; i < args.length; i++) message_string += args[i] + ' ';

        await databasefunctions.SetCloudData(firedb, 'feedback', date.toString(), {
            description: message_string,
            type: 'bot',
        });
        await databasefunctions.IncrementIndex(firedb, 1, 'feedback', 'counter');
    },
};

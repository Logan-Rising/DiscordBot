const fs = require('fs');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');

module.exports = {
    name: 'suggestion',
    description: 'Submits a suggestion for the bot to be added/removed/changed',
    users: [],
    servers: [],
    syntax: '&suggestion <request>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementIndex(firedb, 1, 'commands', this.name);

        var message_string = '\n' + message.author.username + ', ' + message.guild.name + ': ';

        for (var i = 0; i < args.length; i++) message_string += args[i] + ' ';

        fs.appendFile(constants.suggestionsPath, message_string, err => {
            if (err) {
                console.error(err);
            }
            // file written successfully
        });
    },
};

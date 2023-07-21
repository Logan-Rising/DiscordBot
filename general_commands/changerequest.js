const fs = require('fs');
const firebasefunctions = require('../functions/firebasefunctions.js');

module.exports = {
    name: 'suggestion',
    description: 'Submits a suggestion for the bot to be added/removed/changed',
    users: [],
    servers: [],
    syntax: '&changerequest <request>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        var message_string = '\n' + message.author.username + ', ' + message.guild.name + ': ';

        for (var i = 0; i < args.length; i++) message_string += args[i] + ' ';

        fs.appendFile('C:/Users/logan/Desktop/DiscordBot/suggestions.txt', message_string, err => {
            if (err) {
                console.error(err);
            }
            // file written successfully
        });
    },
};

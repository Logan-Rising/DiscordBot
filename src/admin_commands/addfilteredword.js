const databasefunctions = require('../functions/databasefunctions.js');
const messagefunctions = require('../functions/messages.js');

module.exports = {
    name: 'addfilteredword',
    description: "Add a filtered word from this server's filtered word list",
    users: ['admin'],
    servers: [],
    syntax: '&addfilteredword <word>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const word = args[0];

        await databasefunctions.AddServerFilteredWord(firedb, message.guild.id, word.toLowerCase());

        messagefunctions.send_reply(firedb, message, 'Successfully added word to filter list');

        return;
    },
};

const databasefunctions = require('../functions/databasefunctions.js');
const messagefunctions = require('../functions/messages.js');

module.exports = {
    name: 'addfilteredword',
    description: 'Add a filtered word from this server\'s filtered word list',
    users: ['admin'],
    servers: [],
    syntax: '&addfilteredword',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const word = args[0];

        await databasefunctions.AddServerFilteredWord(firedb, message.guild.id, word.toLowerCase());

        messagefunctions.send_reply(firedb, message, 'Successfully added word to filter list');

        return;
    },
};

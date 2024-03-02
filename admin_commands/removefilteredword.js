const databasefunctions = require('../functions/databasefunctions.js');
const messagefunctions = require('../functions/messages.js');

module.exports = {
    name: 'removefilteredword',
    description: 'Remove a filtered word from this server\'s filtered word list',
    users: ['admin'],
    servers: [],
    syntax: '&removefilteredword',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementIndex(firedb, 1, 'commands', this.name);

        const word = args[0];

        await databasefunctions.RemoveServerFilteredWord(firedb, message.guild.id, word);

        messagefunctions.send_reply(firedb, message, 'Successfully removed word from filter list');

        return;
    },
};

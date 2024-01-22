const databasefunctions = require('../functions/databasefunctions.js');
const messagefunctions = require('../functions/messages.js');

module.exports = {
    name: 'resetfilteredwordslist',
    description: 'Reset the filtered word list to an empty list',
    users: ['admin'],
    servers: [],
    syntax: '&resetfilteredwordslist',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        await databasefunctions.SetServerFilterList(firedb, message.guild.id, []);

        messagefunctions.send_reply(firedb, message, 'Successfully reset filtered word list');

        return;
    },
};

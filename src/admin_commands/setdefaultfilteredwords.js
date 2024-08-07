const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../assets/config.js');
const messagefunctions = require('../functions/messages.js');

module.exports = {
    name: 'setdefaultfilteredwords',
    description:
        "Set this server's filtered word list to the default list. Use &viewdefaultfilteredwordlist to view the default filtered words.",
    users: ['admin'],
    servers: [],
    syntax: '&setdefaultfilteredwords',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        await databasefunctions.SetServerFilterList(firedb, message.guild.id, constants.defaultBannedWordList);

        messagefunctions.send_reply(firedb, message, 'Successfully set server filter list to default');

        return;
    },
};

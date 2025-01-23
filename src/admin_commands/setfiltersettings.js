const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'setfiltersettings',
    description: 'Set the filter settings for this server',
    users: ['admin'],
    servers: [],
    syntax: '&setfiltersettings <true/false>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        if (args[0] && args[0].toLowerCase() === 'true') {
            await databasefunctions.SetServerFilterSetting(firedb, message.guild.id, true);
        } else if (args[0] && args[0].toLowerCase() === 'false') {
            await databasefunctions.SetServerFilterSetting(firedb, message.guild.id, false);
        } else {
            await messages.send_reply(firedb, message, "Please enter 'true' or 'false'. Syntax: " + this.syntax);
        }

        messages.send_reply(firedb, message, 'Successfully updated server filter settings');

        return;
    },
};

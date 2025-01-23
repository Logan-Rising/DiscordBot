const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'setchanneldeletelogging',
    description: 'Set channel deletion logging. Will log to log channel if true.',
    users: [],
    servers: [],
    syntax: '&setchanneldeletelogging <true, false>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        if (args[0] && args[0].toLowerCase() === 'true') {
                    await databasefunctions.SetServerChannelDeleteLogging(firedb, message.guild.id, true);
                    await messages.send_reply(firedb, message, "Enabled channel deletion logging");
                } else if (args[0] && args[0].toLowerCase() === 'false') {
                    await databasefunctions.SetServerChannelDeleteLogging(firedb, message.guild.id, false);
                    await messages.send_reply(firedb, message, "Disabled channel deletion logging");
                } else {
                    await messages.send_reply(firedb, message, "Please enter 'true' or 'false'. Syntax: " + this.syntax);
                }

        return;
    },
};

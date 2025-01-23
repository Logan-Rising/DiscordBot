const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'setchannelcreatelogging',
    description: 'Set channel channel logging. Will log to log channel if true.',
    users: [],
    servers: [],
    syntax: '&setchannelcreatelogging <true, false>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);
        
                if (args[0] && args[0].toLowerCase() === 'true') {
                            await databasefunctions.SetServerChannelCreateLogging(firedb, message.guild.id, true);
                            await messages.send_reply(firedb, message, "Enabled channel creation logging");
                        } else if (args[0] && args[0].toLowerCase() === 'false') {
                            await databasefunctions.SetServerChannelCreateLogging(firedb, message.guild.id, false);
                            await messages.send_reply(firedb, message, "Disabled channel creation logging");
                        } else {
                            await messages.send_reply(firedb, message, "Please enter 'true' or 'false'. Syntax: " + this.syntax);
                        }
        
                return;

        return;
    },
};

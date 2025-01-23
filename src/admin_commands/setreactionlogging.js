const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'setreactionlogging',
    description: 'Set reaction logging. Will log when someone reacts to a reaction message created by the bot in designated server to log channel if true.',
    users: [],
    servers: [],
    syntax: '&setreactionlogging <true, false>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

                if (args[0] && args[0].toLowerCase() === 'true') {
                            await databasefunctions.SetServerReactionLogging(firedb, message.guild.id, true);
                            await messages.send_reply(firedb, message, "Enabled reaction logging");
                        } else if (args[0] && args[0].toLowerCase() === 'false') {
                            await databasefunctions.SetServerReactionLogging(firedb, message.guild.id, false);
                            await messages.send_reply(firedb, message, "Disabled reaction logging");
                        } else {
                            await messages.send_reply(firedb, message, "Please enter 'true' or 'false'. Syntax: " + this.syntax);
                        }
        
                return;

        return;
    },
};

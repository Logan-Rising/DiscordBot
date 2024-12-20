const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'setlogchannel',
    description: 'Run this command in the channel you want to set as the log channel for your server.',
    users: ['admin'],
    servers: [],
    syntax: '&setlogchannel',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        await databasefunctions.SetLogChannel(firedb, message.guildId, message.channelId);
        
        await messages.send_reply(firedb, message, `Updated log channel to <#${message.channel.id}>`);

        return;
    },
};

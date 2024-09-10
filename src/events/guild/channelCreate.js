const databasefunctions = require('../../functions/databasefunctions.js');
const messages = require('../../functions/messages.js');

module.exports = async (Discord, client, firedb, channel) => {
    await databasefunctions.AddChannelToServer(firedb, channel.guildId, channel.id, channel.name);
    await messages.server_log(firedb, client, channel.guildId, '**' + channel.name + '** channel has been created');
};

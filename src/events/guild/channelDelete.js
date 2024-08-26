const databasefunctions = require('../../functions/databasefunctions.js');
const messages = require('../../functions/messages.js');

module.exports = async (Discord, client, firedb, channel) => {
    await databasefunctions.RemoveChannelFromServer(firedb, channel.guildId, channel.id);
    await messages.server_log(firedb, client, channel.guildId, '**' + channel.name + '** channel has been deleted');
};
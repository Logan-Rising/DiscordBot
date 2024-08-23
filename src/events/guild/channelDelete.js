const databasefunctions = require('../../functions/databasefunctions.js');
const eventlogging = require('../../functions/eventlogging.js');

module.exports = async (Discord, client, firedb, channel) => {
    await databasefunctions.RemoveChannelFromServer(firedb, channel.guildId, channel.id);
    await eventlogging.ServerLog(firedb, client, channel.guildId, '**' + channel.name + '** channel has been deleted');
};
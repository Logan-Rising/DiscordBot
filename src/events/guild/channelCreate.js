const databasefunctions = require('../../functions/databasefunctions.js');
const eventlogging = require('../../functions/eventlogging.js');

module.exports = async (Discord, client, firedb, channel) => {
    await databasefunctions.AddChannelToServer(firedb, channel.guildId, channel.id, channel.name);
    await eventlogging.ServerLog(firedb, client, channel.guildId, '**' + channel.name + '** channel has been created');
};
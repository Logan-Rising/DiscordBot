const databasefunctions = require('../../functions/databasefunctions.js');
const eventlogging = require('../../functions/eventlogging.js');

module.exports = async (Discord, client, firedb, oldChannel, newChannel) => {
    await databasefunctions.UpdateChannelInServer(firedb, oldChannel.guildId, oldChannel.id, newChannel.id, newChannel.name);
    await eventlogging.ServerLog(firedb, client, oldChannel.guildId, '**' + oldChannel.name + '** channel has been updated');
};
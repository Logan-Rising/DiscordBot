const databasefunctions = require('../../functions/databasefunctions.js');
const messages = require('../../functions/messages.js');

module.exports = async (Discord, client, firedb, oldChannel, newChannel) => {
    await databasefunctions.UpdateChannelInServer(
        firedb,
        oldChannel.guildId,
        oldChannel.id,
        newChannel.id,
        newChannel.name
    );
    
    if (databasefunctions.GetServerChannelUpdateLogging(firedb, channelCreate.guildId)) {
    await messages.server_log(
        firedb,
        client,
        oldChannel.guildId,
        '**' + oldChannel.name + '** channel has been updated'
    );
}
};

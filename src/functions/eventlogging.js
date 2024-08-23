const databasefunctions = require('./databasefunctions.js');
const messaging = require('./messages.js');
const discordfunctions = require('./discordfunctions.js');
const logging = require('./logging.js');

async function ServerLog(firedb, client, serverId, content) {
    try {
        let channelId = await databasefunctions.GetLogChannel(firedb, serverId);
        if (channelId === '') return; // Server does not have a logging channel defined
        let logChannel = await discordfunctions.GetChannel(client, channelId);
        await messaging.send_message(firedb, logChannel, content);
    } catch (error) {
        logging.error(firedb, error);
    }
}

module.exports = {
    ServerLog,
}
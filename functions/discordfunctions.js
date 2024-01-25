async function GetChannel(client, channelId) {
    return await client.channels.cache.find(channel => channel.id === channelId);
}

// Needs testing
async function GetUser(client, userId) {
    return await client.users.fetch(userId);
}

async function GetServerCount(client) {
    return await client.guilds.cache.size;
}

async function ReactToMessage(message, emoji) {
    return await message.react(emoji);
}

async function GetMessageWithMessage(MESSAGE_ID, message) {
    return await message.channel.messages.fetch(MESSAGE_ID)
}

module.exports = {
    GetChannel,
    GetUser,
    GetServerCount,
    ReactToMessage,
    GetMessageWithMessage,
};

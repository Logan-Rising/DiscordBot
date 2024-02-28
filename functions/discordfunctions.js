async function GetGuild(client, guildId) { 
    return await client.guilds.fetch(guildId);
}

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

async function GetMessage(client, messageId, channelId) {
    let channel = await GetChannel(client, channelId);
    return await channel.messages.fetch(messageId);
}

async function GetRole(client, guildId, roleId) {
    const guild = await GetGuild(client, guildId);
    return await guild.roles.cache.get(roleId);
}

module.exports = {
    GetGuild,
    GetChannel,
    GetUser,
    GetServerCount,
    ReactToMessage,
    GetMessageWithMessage,
    GetMessage,
    GetRole,
};

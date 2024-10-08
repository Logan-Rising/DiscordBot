const logging = require('./logging.js');

async function GetGuild(client, guildId) {
    return await client.guilds.fetch(guildId);
}

async function GetChannel(client, channelId) {
    return await client.channels.cache.find(channel => channel.id === channelId);
}

async function GetUser(client, firedb, userId) {
    let user;
    try {
        user = await client.users.fetch(userId);
    } catch (error) {
        logging.error(error);
        return undefined;
    }
    return user;
}

async function GetServerCount(client) {
    return await client.guilds.cache.size;
}

async function ReactToMessage(message, emoji) {
    return await message.react(emoji);
}

async function GetMessageWithMessage(MESSAGE_ID, message) {
    return await message.channel.messages.fetch(MESSAGE_ID);
}

async function GetMessage(client, messageId, channelId) {
    let channel = await GetChannel(client, channelId);
    let message;
    // Set message if if it exists, else set it to undefined
    try {
        message = await channel.messages.fetch(messageId);
    } catch {
        message = undefined;
    }
    return message;
}

async function GetRole(client, guildId, roleId) {
    const guild = await GetGuild(client, guildId);
    return await guild.roles.cache.get(roleId);
}

async function GetGuildChannels(message) {
    return await message.guild.channels.cache.values();
}

async function GetGuildMembers(client, guildId) {
    const guild = client.guilds.resolve(guildId);
    return await guild.members.fetch().catch(console.error);
}

async function GetAllMemberRoles(member, guildId) {
    const roles = [];

    try {
        await member.roles.cache.filter(roles => roles.id !== guildId).map(role => roles.push(role.id));
    } catch (error) {
        await logging.error(error);
    }

    return roles;
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
    GetGuildChannels,
    GetGuildMembers,
    GetAllMemberRoles,
};

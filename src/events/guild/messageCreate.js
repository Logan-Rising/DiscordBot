const permissions = require('../../functions/permissionscheck.js');
const databasefunctions = require('../../functions/databasefunctions.js');
const discordfunctions = require('../../functions/discordfunctions.js');
const messagefilter = require('../../functions/messagefilter.js');
const { PermissionsBitField } = require('discord.js');
const constants = require('../../assets/config.js');

module.exports = async (Discord, client, firedb, message) => {
    const prefix = '&';

    // Increment messages parsed counter
    await databasefunctions.IncrementDailyChannelReadMessage(
        firedb,
        message.guildId,
        message.channelId,
        1,
        message,
        client,
        message.author.id,
        message.guild.name
    );

    if (message.guild === null) {
        // DM
        return;
    }

    if (message.author.id === constants.botId) return;

    if (!message.content.startsWith(prefix) || message.author.bot) {
        messagefilter.FilterMessage(firedb, message, client);
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (cmd != 'removefilteredword' && cmd != 'addfilteredword') {
        messagefilter.FilterMessage(firedb, message, client);
    }

    const command = client.commands.get(cmd);
    if (
        command &&
        permissions.checkValidSend(
            command,
            message.author.id,
            message.guild.id,
            message.member.permissions.has(PermissionsBitField.Flags.Administrator)
        )
    ) {
        command.execute(client, message, args, Discord, firedb);
        await databasefunctions.IncrementDailyServerCommandUsed(firedb, message.guildId, 1);
    }
};

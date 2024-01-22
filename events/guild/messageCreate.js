const permissions = require('../../functions/permissionscheck.js');
const databasefunctions = require('../../functions/databasefunctions.js');
const customfunctions = require('../../functions/customfunctions.js');
const messagefunctions = require('../../functions/messages.js');
const messagefilter = require('../../functions/messagefilter.js');
const { PermissionsBitField } = require('discord.js');
const constants = require('../../constants.js');

module.exports = async (Discord, client, firedb, message) => {
    const prefix = '&';

    // Increment messages parsed counter
    databasefunctions.IncrementMessageRead(firedb, 1);

    if (message.guild === null) {
        // DM
        return;
    }

    if (message.author.id === constants.botId) return;

    if (!message.content.startsWith(prefix) || message.author.bot) {
        messagefilter.FilterMessage(firedb, message);
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (cmd != 'removefilteredword') {
        messagefilter.FilterMessage(firedb, message);
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
    )
        command.execute(client, message, args, Discord, firedb);
};

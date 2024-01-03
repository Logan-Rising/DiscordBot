const permissions = require('../../functions/permissionscheck.js');
const firebasefunctions = require('../../functions/firebasefunctions.js');
const customfunctions = require('../../functions/customfunctions.js');
const messagefunctions = require('../../functions/messages.js');
const { PermissionsBitField } = require('discord.js');

module.exports = (Discord, client, firedb, message) => {
    const prefix = '&';

    // Increment messages parsed counter
    firebasefunctions.IncrementMessageRead(firedb, 1);

    customfunctions.CheckMessage(message);

    if (message.guild === null) {
        // DM
        return;
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

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

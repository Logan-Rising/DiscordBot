const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const kickfunction = require('../assets/config.js');
const constants = require('../assets/config.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    users: ['admin'],
    servers: [],
    syntax: '&kick <@user or user id>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        if ((await message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) && !message.member.bot) {
            const green_check = '✅';
            const red_x = '❌';
            let member = message.mentions.users.first();
            var id;
            if (member) {
                id = member.id;
            } else if (!isNaN(args[0])) {
                id = args[0];
            } else {
                return messages.send_reply(firedb, message, "Error: Couldn't kick that member.");
            }

            const filter = (reaction, user) =>
                [green_check, red_x].includes(reaction.emoji.name) && user.id === message.member.id;
            let kickMessage = await messages.send_message(
                firedb,
                message.channel,
                `Are you sure you want to kick <@${id}>?`
            );
            member = kickMessage.mentions.users.first();
            if (!member) {
                messages.delete_message(firedb, kickMessage);
                return messages.send_message(firedb, message.channel, 'That Is An Invalid User.');
            }
            const memberTarget = await message.guild.members.cache.get(member.id);
            if (!memberTarget.kickable) {
                messages.send_reply(firedb, message, 'Cannot kick that member. Member is not kickable.');
                return;
            }
            await kickMessage.react(green_check);
            await kickMessage.react(red_x);
            const collector = kickMessage.createReactionCollector(filter, { maxEmojis: 2 });
            collector.on('collect', async (reaction, user) => {
                switch (reaction.emoji.name) {
                    case green_check:
                        if (user.id === constants.botId) break;
                        memberTarget.kick();
                        await messages.server_log(firedb, client, message.guild.id, `<@${id}> has been kicked by <@${message.author.id}`);
                        await kickfunction.onKickBan(firedb, memberTarget.user.tag, message.channel, id);
                        collector.stop();
                        break;
                    default:
                        if (user.id === constants.botId) break;
                        await messages.send_message(firedb, message.channel, `<@${id}> lives to see another day`);
                        collector.stop();
                        break;
                }
            });
        }
    },
};

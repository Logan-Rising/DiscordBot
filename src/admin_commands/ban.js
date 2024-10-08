const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const banfunction = require('../assets/config.js');
const { PermissionsBitField } = require('discord.js');
const constants = require('../assets/config.js');

module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    users: ['admin'],
    servers: [],
    syntax: '&ban <@user or user id>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);
        if ((await message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) && !message.member.bot) {
            const green_check = '✅';
            const red_x = '❌';
            let member = message.mentions.users.first();
            var id;
            if (member) {
                id = member.id;
            } else if (!isNaN(args[0])) {
                id = args[0];
            } else {
                return messages.send_message(firedb, message.channel, "Error: Couldn't ban that member");
            }

            const filter = (reaction, user) =>
                [green_check, red_x].includes(reaction.emoji.name) && user.id === message.member.id;
            let banMessage = await messages.send_message(
                firedb,
                message.channel,
                `Are you sure you want to ban <@${id}>?`
            );
            member = banMessage.mentions.users.first();
            if (!member) {
                messages.delete_message(firedb, banMessage);
                return messages.send_message(firedb, message.channel, 'That Is An Invalid User');
            }
            const memberTarget = await message.guild.members.cache.get(member.id);
            if (!memberTarget.bannable) {
                messages.send_reply(firedb, message, 'Cannot kick that member. Member is not bannable.');
                return;
            }
            await banMessage.react(green_check);
            await banMessage.react(red_x);
            const collector = banMessage.createReactionCollector(filter, { maxEmojis: 2 });
            collector.on('collect', async (reaction, user) => {
                switch (reaction.emoji.name) {
                    case green_check:
                        if (user.id === constants.botId) break;
                        memberTarget.ban();
                        await messages.server_log(
                            firedb,
                            client,
                            message.guild.id,
                            `<@${id}> has been banned by <@${message.author.id}`
                        );
                        await banfunction.onKickBan(firedb, memberTarget.user.tag, message.channel, id);
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

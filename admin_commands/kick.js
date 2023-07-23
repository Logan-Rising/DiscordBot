const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const kickfunction = require('../functions/customfunctions.js');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    users: ['admin'],
    servers: [],
    syntax: '&kick <@user or user id>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        if (message.member.hasPermission('KICK_MEMBERS') && !message.member.bot) {
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
                kickMessage.delete();
                return messages.send_message(firedb, message.channel, 'That Is An Invalid User.');
            }
            const memberTarget = await message.guild.members.cache.get(member.id);
            if (!memberTarget.kickable) {
                messages.send_reply(firedb, message, 'Cannot kick that member. Member is not kickable.');
                return;
            }
            await kickMessage.react(green_check);
            await kickMessage.react(red_x);
            const collector = kickMessage.createReactionCollector(filter, { maxEmojis: 1 });
            collector.on('collect', (reaction, user) => {
                switch (reaction.emoji.name) {
                    case green_check:
                        memberTarget.kick();
                        kickfunction.onKickBan(memberTarget.user.tag, message.channel);
                        collector.stop();
                        break;
                    default:
                        messages.send_message(firedb, message.channel, `<@${id}> lives to see another day`);
                        collector.stop();
                        break;
                }
            });
        }
    },
};

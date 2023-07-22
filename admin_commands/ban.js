const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');

module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    users: ['admin'],
    servers: [],
    syntax: '&ban <@user or user id>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);
        if (message.member.hasPermission('BAN_MEMBERS') && !message.member.bot) {
            const green_check = '✅';
            const red_x = '❌';
            let member = message.mentions.users.first();
            var id;
            if (member) {
                id = member.id;
            } else if (!isNaN(args[0])) {
                id = args[0];
            } else {
                return messages.send_message(message.channel, "Error: Couldn't ban that member");
            }

            const filter = (reaction, user) =>
                [green_check, red_x].includes(reaction.emoji.name) && user.id === message.member.id;
            let banMessage = await messages.send_message(message.channel, `Are you sure you want to ban <@${id}>?`);
            member = banMessage.mentions.users.first();
            if (!member) {
                banMessage.delete();
                return messages.send_message(message.channel, 'That Is An Invalid User');
            }
            const memberTarget = await message.guild.members.cache.get(member.id);
            if (!memberTarget.bannable) {
                messages.send_reply(message, 'Cannot kick that member. Member is not bannable.');
                return;
            }
            await banMessage.react(green_check);
            await banMessage.react(red_x);
            const collector = banMessage.createReactionCollector(filter, { maxEmojis: 1 });
            collector.on('collect', (reaction, user) => {
                switch (reaction.emoji.name) {
                    case green_check:
                        memberTarget.ban();
                        kickfunction.onKickBan(memberTarget.user.tag, message.channel);
                        collector.stop();
                        break;
                    default:
                        messages.send_message(message.channel, `<@${id}> lives to see another day`);
                        collector.stop();
                        break;
                }
            });
        }
    },
};

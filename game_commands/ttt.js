const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');

module.exports = {
    name: 'ttt',
    description: 'Play tic-tac-toe with another user',
    users: [],
    servers: [],
    syntax: '&ttt <@user>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const player_1 = message.author.id;

        if (!message.mentions.users.first()) {
            return messages.send_message(firedb, message.channel, 'Must play with a user');
        }

        const player_2 = message.mentions.users.first().id;
        var current_player = player_1;

        const channel = message.channel.id;

        var ul, um, ur, ml, mm, mr, bl, bm, br;
        ul = um = ur = ml = mm = mr = bl = bm = br = '⬜';

        const up_left = '↖️',
            up_mid = '⬆️',
            up_right = '↗️',
            mid_left = '⬅️',
            mid_mid = '⚪',
            mid_right = '➡️',
            bot_left = '↙️',
            bot_mid = '⬇️',
            bot_right = '↘️',
            x = '❌',
            o = '⭕',
            placeholder = '⬜';

        var turn = 1;

        const filter = (reaction, user) =>
            [up_left, up_mid, up_right, mid_left, mid_mid, mid_right, bot_left, bot_mid, bot_right].includes(
                reaction.emoji.name
            ) && user.id === current_player;

        const embed = new Discord.MessageEmbed()
            .setColor('#BFCDEB')
            .setTitle('Tic-Tac-Toe')
            .setDescription(ul + um + ur + '\n' + ml + mm + mr + '\n' + bl + bm + br);

        let messageEmbed = await messages.send_message(firedb, message.channel, embed);

        await messageEmbed.react(up_left);
        await messageEmbed.react(up_mid);
        await messageEmbed.react(up_right);
        await messageEmbed.react(mid_left);
        await messageEmbed.react(mid_mid);
        await messageEmbed.react(mid_right);
        await messageEmbed.react(bot_left);
        await messageEmbed.react(bot_mid);
        await messageEmbed.react(bot_right);

        const collector = messageEmbed.createReactionCollector(filter, { maxEmojis: 9 });

        collector.on('collect', (reaction, user) => {
            switch (reaction.emoji.name) {
                case up_left:
                    if (ul === placeholder) {
                        if (turn % 2 === 0) {
                            ul = o;
                            current_player = player_1;
                        } else {
                            ul = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
                case up_mid:
                    if (um === placeholder) {
                        if (turn % 2 === 0) {
                            um = o;
                            current_player = player_1;
                        } else {
                            um = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
                case up_right:
                    if (ur === placeholder) {
                        if (turn % 2 === 0) {
                            ur = o;
                            current_player = player_1;
                        } else {
                            ur = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
                case mid_left:
                    if (ml === placeholder) {
                        if (turn % 2 === 0) {
                            ml = o;
                            current_player = player_1;
                        } else {
                            ml = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
                case mid_mid:
                    if (mm === placeholder) {
                        if (turn % 2 === 0) {
                            mm = o;
                            current_player = player_1;
                        } else {
                            mm = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
                case mid_right:
                    if (mr === placeholder) {
                        if (turn % 2 === 0) {
                            mr = o;
                            current_player = player_1;
                        } else {
                            mr = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
                case bot_left:
                    if (bl === placeholder) {
                        if (turn % 2 === 0) {
                            bl = o;
                            current_player = player_1;
                        } else {
                            bl = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
                case bot_mid:
                    if (bm === placeholder) {
                        if (turn % 2 === 0) {
                            bm = o;
                            current_player = player_1;
                        } else {
                            bm = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
                case bot_right:
                    if (br === placeholder) {
                        if (turn % 2 === 0) {
                            br = o;
                            current_player = player_1;
                        } else {
                            br = x;
                            current_player = player_2;
                        }
                        turn++;
                    }
                    break;
            }

            const newEmbed = new Discord.MessageEmbed().setDescription(
                ul + um + ur + '\n' + ml + mm + mr + '\n' + bl + bm + br
            );
            messageEmbed.edit(newEmbed);

            if (ul === um && um === ur && ul != placeholder) {
                //First row
                messages.send_message(firedb, message.channel, ul + ' Won');
                collector.stop();
            } else if (ml === mm && mm === mr && ml != placeholder) {
                //Second Row
                messages.send_message(firedb, message.channel, ml + ' Won');
                collector.stop();
            } else if (bl === bm && bm === br && bl != placeholder) {
                //Third row
                messages.send_message(firedb, message.channel, bl + ' Won');
                collector.stop();
            } else if (ul === ml && ml === bl && ul != placeholder) {
                //First column
                messages.send_message(firedb, message.channel, ul + ' Won');
                collector.stop();
            } else if (um === mm && mm === bm && um != placeholder) {
                //Second Column
                messages.send_message(firedb, message.channel, um + ' Won');
                collector.stop();
            } else if (ur === mr && mr === br && ur != placeholder) {
                //Third Column
                messages.send_message(firedb, message.channel, ur + ' Won');
                collector.stop();
            } else if (ul === mm && mm === br && ul != placeholder) {
                //First Diagonal
                messages.send_message(firedb, message.channel, ul + ' Won');
                collector.stop();
            } else if (ur === mm && mm === bl && ur != placeholder) {
                messages.send_message(firedb, message.channel, ur + ' Won');
                collector.stop();
            } else if (turn === 10) {
                messages.send_message(firedb, message.channel, 'It was a tie');
                collector.stop();
            }
        });
    },
};

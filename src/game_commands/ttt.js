const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ttt',
    description: 'Play tic-tac-toe with another user with a 2 minute time limit',
    users: [],
    servers: [],
    syntax: '&ttt <@user>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const player_1 = message.author.id;
        const player1_name = message.author.username;

        if (!message.mentions.users.first()) {
            return messages.send_message(firedb, message.channel, 'Must play with a user');
        }

        const player_2 = message.mentions.users.first().id;
        const player2_name = message.mentions.users.first().username;
        let current_player = player_1;

        let ul, um, ur, ml, mm, mr, bl, bm, br;
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

        let turn = 1;

        const reactionCollectorFilter = (reaction, user) =>
            [up_left, up_mid, up_right, mid_left, mid_mid, mid_right, bot_left, bot_mid, bot_right].includes(
                reaction.emoji.name
            ) && user.id === current_player;

        const embed = new EmbedBuilder()
            .setColor('#BFCDEB')
            .setTitle('Tic-Tac-Toe')
            .setDescription(
                (turn % 2 ? player1_name : player2_name) +
                    "'s turn\n" +
                    ul +
                    um +
                    ur +
                    '\n' +
                    ml +
                    mm +
                    mr +
                    '\n' +
                    bl +
                    bm +
                    br
            );

        let messageEmbed = await messages.send_message(firedb, message.channel, { embeds: [embed] });

        await messageEmbed.react(up_left);
        await messageEmbed.react(up_mid);
        await messageEmbed.react(up_right);
        await messageEmbed.react(mid_left);
        await messageEmbed.react(mid_mid);
        await messageEmbed.react(mid_right);
        await messageEmbed.react(bot_left);
        await messageEmbed.react(bot_mid);
        await messageEmbed.react(bot_right);

        const collector = messageEmbed.createReactionCollector({
            filter: reactionCollectorFilter,
            maxEmojis: 9,
            time: 120_000,
        });

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

            const newEmbed = new EmbedBuilder()
                .setColor('#BFCDEB')
                .setTitle('Tic-Tac-Toe')
                .setDescription(
                    (turn % 2 ? player1_name : player2_name) +
                        "'s turn\n" +
                        ul +
                        um +
                        ur +
                        '\n' +
                        ml +
                        mm +
                        mr +
                        '\n' +
                        bl +
                        bm +
                        br
                );
            messageEmbed.edit({ embeds: [newEmbed] });

            let winner;
            if (ul === um && um === ur && ul != placeholder) {
                //First row
                winner = ul;
                collector.stop();
            } else if (ml === mm && mm === mr && ml != placeholder) {
                //Second Row
                winner = ml;
                collector.stop();
            } else if (bl === bm && bm === br && bl != placeholder) {
                //Third row
                winner = bl;
                collector.stop();
            } else if (ul === ml && ml === bl && ul != placeholder) {
                //First column
                winner = ul;
                collector.stop();
            } else if (um === mm && mm === bm && um != placeholder) {
                //Second Column
                winner = um;
                collector.stop();
            } else if (ur === mr && mr === br && ur != placeholder) {
                //Third Column
                winner = ur;
                collector.stop();
            } else if (ul === mm && mm === br && ul != placeholder) {
                //First Diagonal
                winner = ul;
                collector.stop();
            } else if (ur === mm && mm === bl && ur != placeholder) {
                winner = ur;
                collector.stop();
            } else if (turn === 10) {
                messages.send_message(firedb, message.channel, 'It was a tie');
                collector.stop();
            }

            if (winner != undefined) {
                if (winner === x) {
                    // Player 1 won
                    messages.send_message(firedb, message.channel, `<@${player_1}> Won!`);
                } else {
                    messages.send_message(firedb, message.channel, `<@${player_2}> Won!`);
                }
            }
        });
    },
};

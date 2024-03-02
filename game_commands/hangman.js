const { Channel } = require('discord.js');
const randomWord = require('random-word');
const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hangman',
    description: 'Play hangman with a randomly generated word. Send a letter guess as a message.',
    users: [],
    servers: [],
    syntax: '&hangman',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        let word = randomWord();
        var answerArray = new Array(word.length);
        var gameOver = false;
        var found = false;
        var str;
        var wrong = 0;
        var lettersGuessed = new Array(26);
        var turn = 0;

        for (var i = 0; i < word.length; i++) {
            answerArray[i] = '_';
        }

        str = answerArray.join(' ');

        const embed = new EmbedBuilder()
            .setColor('#BFCDEB')
            .setTitle('Hangman')
            .setDescription(
                '⬜ ⬜ ⬜ ⬜ ⬜ ' +
                    '\n' +
                    '⬜' +
                    '\n' +
                    '⬜' +
                    '\n' +
                    '⬜' +
                    '\n' +
                    '⬜' +
                    '\n' +
                    '⬜' +
                    '\n' +
                    '⬜' +
                    '\n' +
                    '⬜' +
                    '\n' +
                    '⬜' +
                    '\n' +
                    '⬜ ⬜ ⬜ ⬜ ⬜ ⬜ ' +
                    '\n'
            )
            .setFooter({text: 'Word: ' + str + '\n' + 'Letters Guessed: ' + lettersGuessed.join(',')});

        let messageEmbed = await messages.send_message(firedb, message.channel, {embeds: [embed] });

        const filter = m =>
            [
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'w',
                'x',
                'y',
                'z',
                'end',
            ].includes(m.content.toLowerCase()) &&
            gameOver === false &&
            m.author.id == message.author.id;
        const collector = message.channel.createMessageCollector(filter, { maxProcessed: 27 });

        collector.on('collect', m => {
            if (m.content.toLowerCase() === 'end') {
                messages.send_message(
                    firedb,
                    message.channel,
                    'Thanks for playing! Game will end now. Word was: ' + word
                );
                collector.stop();
            }
            if (!lettersGuessed.includes(m.content.toLowerCase())) {
                lettersGuessed[turn] = m.content.toLowerCase();
                turn++;
                for (var i = 0; i < word.length; i++) {
                    if (word.charAt(i) === m.content.toLowerCase()) {
                        answerArray[i] = m.content.toLowerCase();
                        found = true;
                    }
                }

                str = answerArray.join(' ');

                if (found === false) wrong++;

                if (wrong === 0) {
                    const newEmbed = new EmbedBuilder()
                        .setDescription(
                            '⬜ ⬜ ⬜ ⬜ ⬜ ' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜ ⬜ ⬜ ⬜ ⬜ ⬜ '
                        )
                        .setFooter({text: 'Word: ' + str + '\n' + 'Letters Guessed: ' + lettersGuessed.join(',')});
                    messageEmbed.edit({ embeds: [newEmbed] });
                }

                if (wrong === 1) {
                    const newEmbed = new EmbedBuilder()
                        .setDescription(
                            '⬜ ⬜ ⬜ ⬜ ⬜ ' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇴' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ⬜ ⬜ ⬜ ⬜ ⬜ '
                        )
                        .setFooter({text: 'Word: ' + str + '\n' + 'Letters Guessed: ' + lettersGuessed.join(',')});
                    messageEmbed.edit({ embeds: [newEmbed] });
                } else if (wrong === 2) {
                    const newEmbed = new EmbedBuilder()
                        .setDescription(
                            '⬜ ⬜ ⬜ ⬜ ⬜ ' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇴' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇮' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇮' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ⬜ ⬜ ⬜ ⬜ ⬜ '
                        )
                        .setFooter({text: 'Word: ' + str + '\n' + 'Letters Guessed: ' + lettersGuessed.join(',')});
                    messageEmbed.edit({ embeds: [newEmbed] });
                } else if (wrong === 3) {
                    const newEmbed = new EmbedBuilder()
                        .setDescription(
                            '⬜ ⬜ ⬜ ⬜ ⬜ ' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇴' +
                                '\n' +
                                '⬜ ⬛⬛↖️🇮' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇮' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ⬜ ⬜ ⬜ ⬜ ⬜ '
                        )
                        .setFooter({text: 'Word: ' + str + '\n' + 'Letters Guessed: ' + lettersGuessed.join(',')});
                    messageEmbed.edit({ embeds: [newEmbed] });
                } else if (wrong === 4) {
                    const newEmbed = new EmbedBuilder()
                        .setDescription(
                            '⬜ ⬜ ⬜ ⬜ ⬜ ' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇴' +
                                '\n' +
                                '⬜ ⬛⬛↖️🇮↗️' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇮' +
                                '\n' +
                                '⬜' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ⬜ ⬜ ⬜ ⬜ ⬜ '
                        )
                        .setFooter({text: 'Word: ' + str + '\n' + 'Letters Guessed: ' + lettersGuessed.join(',')});
                    messageEmbed.edit({ embeds: [newEmbed] });
                } else if (wrong === 5) {
                    const newEmbed = new EmbedBuilder()
                        .setDescription(
                            '⬜ ⬜ ⬜ ⬜ ⬜ ' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇴' +
                                '\n' +
                                '⬜ ⬛⬛↖️🇮↗️' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇮' +
                                '\n' +
                                '⬜ ⬛⬛↙️' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ⬜ ⬜ ⬜ ⬜ ⬜ '
                        )
                        .setFooter({text: 'Word: ' + str + '\n' + 'Letters Guessed: ' + lettersGuessed.join(',')});
                    messageEmbed.edit({ embeds: [newEmbed] });
                } else if (wrong === 6) {
                    const newEmbed = new EmbedBuilder()
                        .setDescription(
                            '⬜ ⬜ ⬜ ⬜ ⬜ ' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇴' +
                                '\n' +
                                '⬜ ⬛⬛↖️🇮↗️' +
                                '\n' +
                                '⬜ ⬛⬛⬛🇮' +
                                '\n' +
                                '⬜ ⬛⬛↙️⬛↘️' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ' +
                                '\n' +
                                '⬜ ⬜ ⬜ ⬜ ⬜ ⬜ '
                        )
                        .setFooter({text: 'Word: ' + str + '\n' + 'Letters Guessed: ' + lettersGuessed.join(',')});
                    messageEmbed.edit({ embeds: [newEmbed] });
                    messages.send_message(
                        firedb,
                        message.channel,
                        'You lost! Feel free to try again! The word was: ' + word
                    );
                    gameOver = true;
                    collector.stop();
                }

                found = false;
                for (var i = 0; i < answerArray.length; i++) {
                    if (answerArray[i] === '_') {
                        found = true;
                        break;
                    }
                }

                if (found === false) {
                    messages.send_message(firedb, message.channel, 'You won! The word was: ' + word);
                    collector.stop();
                }
                found = false;

                messages.delete_message(firedb, m);
            } else {
                messages.send_message(firedb, message.channel, 'You have already guessed that letter');
                messages.delete_message(firedb, m);
            }
        });
    },
};

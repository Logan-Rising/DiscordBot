const fs = require('fs');
const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const permissions = require('../functions/permissionscheck.js');
const constants = require('../constants.js');

module.exports = {
    name: 'help',
    description: 'This is a help command',
    users: [],
    servers: [],
    syntax: '&help [command type or command name]',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        var embed_string = 'Prefix: &\n';

        var admin = message.member.hasPermission('ADMINISTRATOR');

        const channel = message.channel,
            guild = channel.guild,
            everyone = guild.roles.everyone;
        var private = !channel.permissionsFor(everyone).has('VIEW_CHANNEL');

        let general_bool = false,
            game_bool = false,
            admin_bool = false,
            image_bool = false,
            custom_bool = false,
            searchForCommand = false;
        commandFound = false;

        if (!args[0]) {
            general_bool = true;
            game_bool = true;
            admin_bool = true;
            image_bool = true;
            custom_bool = true;
        } else if (args[0].toLowerCase() === 'general') general_bool = true;
        else if (args[0].toLowerCase() === 'game') game_bool = true;
        else if (args[0].toLowerCase() === 'admin') admin_bool = true;
        else if (args[0].toLowerCase() === 'image') image_bool = true;
        else if (args[0].toLowerCase() === 'custom') custom_bool = true;
        else {
            searchForCommand = true;
            general_bool = true;
            game_bool = true;
            admin_bool = true;
            image_bool = true;
            custom_bool = true;
        }

        // General Commands
        if (general_bool && !commandFound) {
            const command_files_general = fs.readdirSync('./general_commands/').filter(file => file.endsWith('.js'));
            !searchForCommand ? (embed_string += '\nGeneral: \n') : (embed_string += '');

            for (const file of command_files_general) {
                const command = require(`../general_commands/${file}`);
                if (
                    command.name &&
                    command.description &&
                    permissions.checkValidSend(command, message.author.id, message.guild.id, admin)
                ) {
                    if (searchForCommand) {
                        if (command.name === args[0]) {
                            embed_string +=
                                'Command: ' +
                                command.name +
                                '\n' +
                                'Description: ' +
                                command.description +
                                '\n' +
                                'Syntax: ' +
                                command.syntax;
                            commandFound = true;
                            break;
                        }
                    } else {
                        embed_string += command.name + ': ' + command.description + '\n';
                    }
                }
            }
        }

        // Game Commands
        if (game_bool && !commandFound) {
            const command_files_game = fs.readdirSync('./game_commands/').filter(file => file.endsWith('.js'));
            !searchForCommand ? (embed_string += '\nGame: \n') : (embed_string += '');

            for (const file of command_files_game) {
                const command = require(`../game_commands/${file}`);
                if (
                    command.name &&
                    command.description &&
                    permissions.checkValidSend(command, message.author.id, message.guild.id, admin)
                ) {
                    if (searchForCommand) {
                        if (command.name === args[0]) {
                            embed_string +=
                                'Command: ' +
                                command.name +
                                '\n' +
                                'Description: ' +
                                command.description +
                                '\n' +
                                'Syntax: ' +
                                command.syntax;
                            commandFound = true;
                            break;
                        }
                    } else {
                        embed_string += command.name + ': ' + command.description + '\n';
                    }
                } else {
                    continue;
                }
            }
        }

        // Image Commands
        if (image_bool && !commandFound) {
            const command_files_image = fs.readdirSync('./image_commands/').filter(file => file.endsWith('.js'));
            !searchForCommand ? (embed_string += '\nImage: \n') : (embed_string += '');

            for (const file of command_files_image) {
                const command = require(`../image_commands/${file}`);
                if (
                    command.name &&
                    command.description &&
                    permissions.checkValidSend(command, message.author.id, message.guild.id, admin)
                ) {
                    if (searchForCommand) {
                        if (command.name === args[0]) {
                            embed_string +=
                                'Command: ' +
                                command.name +
                                '\n' +
                                'Description: ' +
                                command.description +
                                '\n' +
                                'Syntax: ' +
                                command.syntax;
                            commandFound = true;
                            break;
                        }
                    } else {
                        embed_string += command.name + ': ' + command.description + '\n';
                    }
                } else {
                    continue;
                }
            }
        }

        // Admin commands
        if (admin_bool && !commandFound) {
            if (admin && private) {
                const command_files_admin = fs.readdirSync('./admin_commands/').filter(file => file.endsWith('.js'));
                !searchForCommand ? (embed_string += '\nAdmin: \n') : (embed_string += '');

                for (const file of command_files_admin) {
                    const command = require(`../admin_commands/${file}`);
                    if (
                        command.name &&
                        command.description &&
                        permissions.checkValidSend(command, message.author.id, message.guild.id, admin)
                    ) {
                        if (searchForCommand) {
                            if (command.name === args[0]) {
                                embed_string +=
                                    'Command: ' +
                                    command.name +
                                    '\n' +
                                    'Description: ' +
                                    command.description +
                                    '\n' +
                                    'Syntax: ' +
                                    command.syntax;
                                commandFound = true;
                                break;
                            }
                        } else {
                            embed_string += command.name + ': ' + command.description + '\n';
                        }
                    } else {
                        continue;
                    }
                }
            }
        }

        // Custom Commands
        if (custom_bool && !commandFound && private) {
            const command_files_general = fs.readdirSync('./custom_commands/').filter(file => file.endsWith('.js'));
            !searchForCommand ? (embed_string += '\nCustom: \n') : (embed_string += '');

            for (const file of command_files_general) {
                const command = require(`../custom_commands/${file}`);
                if (
                    command.name &&
                    command.description &&
                    permissions.checkValidSend(command, message.author.id, message.guild.id, admin)
                ) {
                    if (searchForCommand) {
                        if (command.name === args[0]) {
                            embed_string +=
                                'Command: ' +
                                command.name +
                                '\n' +
                                'Description: ' +
                                command.description +
                                '\n' +
                                'Syntax: ' +
                                command.syntax;
                            commandFound = true;
                            break;
                        }
                    } else {
                        embed_string += command.name + ': ' + command.description + '\n';
                    }
                }
            }
        }

        if (embed_string === 'Prefix: &\n') {
            messages.send_reply(message, 'Could not find that command. Use &help to list commands.');
            return;
        }

        !searchForCommand ? embed_string += '\nNeed help with a specific command?  Use &help <command name>' : embed_string += '';

        const embed = new Discord.MessageEmbed()
            .setColor('#BFCDEB')
            .setTitle(constants.botName + ' Commands')
            .setDescription(embed_string);

        messages.send_message(message.channel, embed);
    },
};

const fs = require('fs');
const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const permissions = require('../functions/permissionscheck.js');
const constants = require('../constants/constants.js');
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'This is a help command',
    users: [],
    servers: [],
    syntax: '&help [command type or command name]',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementIndex(firedb, 1, 'commands', this.name);

        let embed_string = 'Prefix: &\n';

        let admin = message.member.permissions.has(PermissionsBitField.Flags.Administrator);


        const channel = message.channel,
            guild = channel.guild,
            everyone = guild.roles.everyone,
            ageRestricted = channel.nsfw;

        // Privacy of the channel
        let private = !channel.permissionsFor(everyone).has(PermissionsBitField.Flags.ViewChannel);
        const privateInitial = private;

        if(!private) {
            // If channel is age restricted and not private but should be included as private
            private = ageRestricted && constants.includeAgeRestrictionAsPrivate;
        }

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
            if (admin && privateInitial) {
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
            messages.send_reply(firedb, message, 'Could not find that command. Use &help to list commands.');
            return;
        }

        !searchForCommand
            ? (embed_string += '\nNeed help with a specific command?  Use &help <command name>')
            : (embed_string += '');

        const embed = new EmbedBuilder()
            .setColor('#BFCDEB')
            .setTitle(constants.botName + ' Commands')
            .setDescription(embed_string);

        messages.send_message(firedb, message.channel, {embeds: [embed] });
    },
};

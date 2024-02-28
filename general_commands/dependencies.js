const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const package = require('../package.json');
const constants = require('../constants/constants.js');
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'dependencies',
    description: 'Returns the packages used in the discord bot',
    users: [],
    servers: [],
    syntax: '&dependencies',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        let dependencies_string = '';

        for (const pkg in package.dependencies) {
            dependencies_string += `${pkg}:${package.dependencies[pkg]}` + '\n';
        }

        const embed = new EmbedBuilder()
            .setColor('#BFCDEB')
            .setTitle(constants.botName + ' Dependencies')
            .setDescription(dependencies_string);

        messages.send_message(firedb, message.channel, { embeds: [embed] });
    },
};

const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'specs',
    description: 'Returns the specs of the computer that runs the discord bot',
    users: [],
    servers: [],
    syntax: '&specs',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        if (!constants.specs.specsString || !constants.specs.specsPhoto || !constants.botName) {
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#BFCDEB')
            .setTitle(constants.botName + ' Specs')
            .setDescription(constants.specs.specsString)
            .setImage(constants.specs.specsPhoto);

        messages.send_message(firedb, message.channel, { embeds: [embed] });
    },
};

const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');
const { REST, Routes, ApplicationCommandOptionType  } = require('discord.js');

module.exports = {
    name: 'deleteguildcommand',
    description: '',
    users: [],
    servers: [],
    syntax: '&deleteguildcommand',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const rest = new REST({ version: '10' }).setToken(constants.DISCORD_TOKEN);

        // ...

        // for guild-based commands
        rest.delete(Routes.applicationGuildCommand(constants.CLIENT_ID, message.guild.id, '1203235279729598464'))
            .then(() => console.log('Successfully deleted guild command'))
            .catch(console.error);

        // for global commands
        rest.delete(Routes.applicationCommand(constants.CLIENT_ID, 'commandId'))
            .then(() => console.log('Successfully deleted application command'))
            .catch(console.error);

        return;
    },
};

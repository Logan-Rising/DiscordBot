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
        await databasefunctions.IncrementIndex(firedb, 1, 'commands', this.name);

        const rest = new REST({ version: '10' }).setToken(constants.DISCORD_TOKEN);

        // ...

        // Comment out which ever one is not in use

        // for guild-based commands
        // rest.delete(Routes.applicationGuildCommand(constants.CLIENT_ID, message.guild.id, args[0]))
        //     .then(() => console.log('Successfully deleted guild command'))
        //     .catch(console.error);

        // for global commands
        rest.delete(Routes.applicationCommand(constants.CLIENT_ID, args[0]))
            .then(() => console.log('Successfully deleted application command'))
            .catch(console.error);

        return;
    },
};

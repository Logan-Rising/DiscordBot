const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');
const { REST, Routes, ApplicationCommandOptionType  } = require('discord.js');

module.exports = {
    name: 'registerguildcommand',
    description: '',
    users: [constants.ownerId],
    servers: [],
    syntax: '&registerguildcommand <command name>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const commandName = args[0];
        let description = '';
        const clientId = constants.CLIENT_ID;
        const guildId = message.guild.id;

        for ( let i = 1; i < args.length; i++ ){
            description += args[i] + ' ';
        }

        const commands = [
            {
                name: 'reactionrole',
                description: 'Create a reaction role message to assign up to 5 roles to members',
                options: [
                    {
                        name: 'title',
                        description: 'Title of the reaction role group',
                        type: ApplicationCommandOptionType.String,
                    },
                    {
                        name: 'role1',
                        description: 'The first role to include',
                        type: ApplicationCommandOptionType.Role,
                    },
                    {
                        name: 'role2',
                        description: 'The second role to include',
                        type: ApplicationCommandOptionType.Role,
                    },
                    {
                        name: 'role3',
                        description: 'The third role to include',
                        type: ApplicationCommandOptionType.Role,
                    },
                    {
                        name: 'role4',
                        description: 'The fourth role to include',
                        type: ApplicationCommandOptionType.Role,
                    },
                    {
                        name: 'role5',
                        description: 'The fifth role to include',
                        type: ApplicationCommandOptionType.Role,
                    },
                ]
            },
        ]
        
        const rest = new REST().setToken(constants.DISCORD_TOKEN);
        
        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
        
                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                );
        
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();

        return;
    },
};

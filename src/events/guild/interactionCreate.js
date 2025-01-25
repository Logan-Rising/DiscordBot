const databasefunctions = require('../../functions/databasefunctions.js');

module.exports = async (Discord, client, firedb, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    databasefunctions.IncrementDaily(firedb, 1, 'messaging', 'interactions_received');

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, firedb, client);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};

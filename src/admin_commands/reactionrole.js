const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const databasefunctions = require('../functions/databasefunctions.js');
const reactionmessagefunctions = require('../functions/reactionmessagefunctions.js');
const interactionfunctions = require('../functions/interactionfunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Create a reaction role message to assign up to 5 roles to members')
        .addStringOption(option =>
            option.setName('title').setDescription('Title of the reaction role group').setRequired(false)
        )
        .addRoleOption(option => option.setName('role1').setDescription('Role 1 to set up').setRequired(false))
        .addRoleOption(option => option.setName('role2').setDescription('Role 2 to set up').setRequired(false))
        .addRoleOption(option => option.setName('role3').setDescription('Role 3 to set up').setRequired(false))
        .addRoleOption(option => option.setName('role4').setDescription('Role 4 to set up').setRequired(false))
        .addRoleOption(option => option.setName('role5').setDescription('Role 5 to set up').setRequired(false)),
    async execute(interaction, firedb, client) {
        const title = interaction.options.getString('title');
        const role1 = interaction.options.getRole('role1');
        const role2 = interaction.options.getRole('role2');
        const role3 = interaction.options.getRole('role3');
        const role4 = interaction.options.getRole('role4');
        const role5 = interaction.options.getRole('role5');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({
                content: 'You must have admin permissions to create a reaction role message',
                ephemeral: true,
            });

        if (!role1 && !role2 && !role3 && !role4 && !role5) {
            await interactionfunctions.Reply(firedb, interaction, {
                content: 'Must include at least one role for the reaction role message',
            });
            return;
        }

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('button1')
                .setLabel(`${role1 ? role1.name : 'N/A'}`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(!role1),

            new ButtonBuilder()
                .setCustomId('button2')
                .setLabel(`${role2 ? role2.name : 'N/A'}`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(!role2),

            new ButtonBuilder()
                .setCustomId('button3')
                .setLabel(`${role3 ? role3.name : 'N/A'}`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(!role3),

            new ButtonBuilder()
                .setCustomId('button4')
                .setLabel(`${role4 ? role4.name : 'N/A'}`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(!role4),

            new ButtonBuilder()
                .setCustomId('button5')
                .setLabel(`${role5 ? role5.name : 'N/A'}`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(!role5)
        );

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(title ? title : 'Reaction Roles')
            .setDescription(
                `React with the buttons below to get the specified roles! \n` +
                    (role1 ? `${role1}` + `\n` : ``) +
                    (role2 ? `${role2}` + `\n` : ``) +
                    (role3 ? `${role3}` + `\n` : ``) +
                    (role4 ? `${role4}` + `\n` : ``) +
                    (role5 ? `${role5}` : ``)
            );

        let roleMessage = await messages.send_message(firedb, interaction.channel, { embeds: [embed], components: [button] });

        await databasefunctions.IncrementReactionRoleMessageCount(firedb, interaction.guild.id);

        await reactionmessagefunctions.StoreReactionMessage(
            firedb,
            interaction.guild.id,
            interaction.channel.id,
            roleMessage.id,
            role1 ? role1.id : '',
            role2 ? role2.id : '',
            role3 ? role3.id : '',
            role4 ? role4.id : '',
            role5 ? role5.id : ''
        );

        await reactionmessagefunctions.CreateComponentCollector(firedb, client, roleMessage, role1, role2, role3, role4, role5);

        await interactionfunctions.Reply(firedb, interaction, `Successfully set up reaction message for **${title}**! You can delete this message.`);
    },
};

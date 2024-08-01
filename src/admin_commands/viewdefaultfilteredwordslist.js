const databasefunctions = require('../functions/databasefunctions.js');
const messagefunctions = require('../functions/messages.js');
const constants = require('../assets/config.js');

module.exports = {
    name: 'viewdefaultfilteredwordslist',
    description: 'View the default filtered word list',
    users: ['admin'],
    servers: [],
    syntax: '&viewdefaultfilteredwordslist',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const reactionCollectorFilter = (reaction, user) =>
            ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;

        const warningMessage = await messagefunctions.send_message(
            firedb,
            message.channel,
            'Warning: you may be exposed to vulgar and inappropriate words. Would you like to continue? ' +
                'React ✅ to continue.'
        );

        await warningMessage.react('✅');

        const collector = warningMessage.createReactionCollector({
            filter: reactionCollectorFilter,
            maxEmojis: 1,
            time: 15_000,
        });

        collector.on('collect', async (reaction, user) => {
            await messagefunctions.send_message(firedb, message.channel, constants.defaultBannedWordList.join(', '));
        });

        return;
    },
};

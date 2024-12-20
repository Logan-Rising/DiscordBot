const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'setpenalty',
    description: 'Set the penalty for a user going over the max filter violations. Either mute, kick, or ban.',
    users: ['admin'],
    servers: [],
    syntax: '&setpenalty <mute, kick, or ban>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const penalties = ['mute', 'kick', 'ban']
        if (penalties.includes(args[0])){
            await databasefunctions.SetServerPenalty(firedb, message.guild.id, args[0]);
            await messages.send_reply(firedb, message, 'Penalty set to ' + args[0]);
        } else {
            await messages.send_reply(firedb, message, 'Penalty must be mute, kick, or ban');
        }

        return;
    },
};

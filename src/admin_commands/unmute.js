const databasefunctions = require('../functions/databasefunctions.js');
const discordfunctions = require('../functions/discordfunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'unmute',
    description: '',
    users: [],
    servers: [],
    syntax: '&unmute',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) return messages.send_reply(firedb, message, 'Please specify a member with a tag or id')

        const mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');

        const memberData = await databasefunctions.GetCloudData(firedb, 'muted', member.id + '-' + message.guild.id);

        if (!memberData) {
            if (message) await messages.send_reply(firedb, message, `<@${member.id}> is already unmuted`);
            return;
        }

        for (let i = 0; i < memberData.roles.length; i++) {
            const role = await discordfunctions.GetRole(client, message.guild.id, memberData.roles[i]);
            member.roles.add(role);
        }

        await databasefunctions.DeleteFirebaseDocument(firedb, 'muted', member.id + '-' + message.guild.id);

        await member.roles.remove(mutedRole);

        await messages.send_reply(firedb, message, `Unmuted <@${member.id}>`);
        return;
    },
};

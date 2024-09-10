const databasefunctions = require('../functions/databasefunctions.js');
const discordfunctions = require('../functions/discordfunctions.js');
const messages = require('../functions/messages.js');

module.exports = {
    name: 'mute',
    description: '',
    users: [],
    servers: [],
    syntax: '&mute',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) return messages.send_reply(firedb, message, 'Please specify a member with a tag or id')

        const mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');

        if (!mutedRole) return messages.send_reply(firedb, message, 'There is no Muted role on this server');

        let roles = await discordfunctions.GetAllMemberRoles(member, message.guild.id);

        await databasefunctions.SetCloudData(firedb, 'muted', member.id + '-' + message.guild.id, {
            roles: roles,
        });

        for (let i = 0; i < roles.length; i++) {
            const role = await discordfunctions.GetRole(client, message.guild.id, roles[i]);
            member.roles.remove(role);
        }

        await member.roles.add(mutedRole);

        await messages.send_reply(firedb, message, `Muted <@${member.id}>`);
        return;
    },
};

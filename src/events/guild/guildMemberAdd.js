const databasefunctions = require('../../functions/databasefunctions.js');
const eventlogging = require('../../functions/eventlogging.js');

module.exports = async (Discord, client, firedb, member) => {
    await databasefunctions.AddMemberToServer(firedb, member.guild.id, member.user.id, member.user.username);
    await eventlogging.ServerLog(firedb, client, member.guild.id, `<@${member.user.id}> has joined the server!`);
};
const databasefunctions = require('../../functions/databasefunctions.js');
const eventlogging = require('../../functions/eventlogging.js');

module.exports = async (Discord, client, firedb, member) => {
    await databasefunctions.RemoveMemberFromServer(firedb, member.guild.id, member.user.id);
    await eventlogging.ServerLog(firedb, client, member.guild.id, `<@${member.user.id}> has left the server :(`);
};
const databasefunctions = require('../../functions/databasefunctions.js');
const messages = require('../../functions/messages.js');

module.exports = async (Discord, client, firedb, member) => {
    await databasefunctions.RemoveMemberFromServer(firedb, member.guild.id, member.user.id);
    await messages.server_log(firedb, client, member.guild.id, `<@${member.user.id}> has left the server :(`);
};

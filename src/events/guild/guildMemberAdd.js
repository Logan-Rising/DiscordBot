const databasefunctions = require('../../functions/databasefunctions.js');
const messages = require('../../functions/messages.js');

module.exports = async (Discord, client, firedb, member) => {
    await databasefunctions.AddMemberToServer(firedb, member.guild.id, member.user.id, member.user.username);
    await messages.server_log(firedb, client, member.guild.id, `<@${member.user.id}> has joined the server!`);
};
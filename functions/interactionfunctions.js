const databasefunctions = require('./databasefunctions.js');
const discordfunctions = require('./discordfunctions.js');

async function Reply(firedb, interaction, reply) {
    return await interaction.reply(reply);
}

async function DeleteReply(firedb, interaction) {
    return await interaction.deleteReply();
}

async function FetchReply(firedb, interaction) {
    return await interaction.fetchReply();
}

async function FollowUp(firedb, interaction, followUpMessage) {
    return await interaction.followUp(followUpMessage);
}

async function EditRply(firedb, interaction, editedReply){
    return await interaction.editReply(editedReply);
}

module.exports = { Reply, DeleteReply, FetchReply, FollowUp, EditRply };
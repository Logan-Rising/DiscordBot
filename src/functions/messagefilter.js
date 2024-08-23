const databasefunctions = require('./databasefunctions.js');
const discordfunctions = require('./discordfunctions.js');
const messagefunctions = require('./messages.js');
const constants = require('../assets/config.js');

async function FilterMessage(firedb, message, client) {
    // Server exists in filter database

    const serverFilterInfo = await databasefunctions.GetServerFilterInfo(message.guild.id);
    if (serverFilterInfo) {
        if (await databasefunctions.GetServerFilterSetting(message.guild.id)) {
            const serverFilteredWordList = await databasefunctions.GetServerFilterList(message.guild.id);

            const messageString = message.content.toLowerCase().split(' ').join('');

            for (i = 0; i < serverFilteredWordList.length; i++) {
                if (messageString.includes(serverFilteredWordList[i])) {
                    const wordFiltered = serverFilteredWordList[i];
                    messagefunctions.send_message(
                        firedb,
                        message.author,
                        "The word '" +
                            wordFiltered +
                            "' is not allowed in " +
                            message.guild.name +
                            '. Please refrain from using it in the future. Thank you!'
                    );
                    await messagefunctions.delete_message(firedb, message);
                    await databasefunctions.IncrementServerFilteredMessages(firedb, message.guildId, 1);
                }
            }
        }
        if (!serverFilterInfo.channels[message.channel.id]) {   // Channel is not in the server channel list so add it
            const channel = await discordfunctions.GetChannel(client, message.channel.id);
            await databasefunctions.AddChannelToServer(firedb, message.guild.id, message.channel.id, channel.name);
        }
        if(!serverFilterInfo.members[message.author.id]) {      // User is not in the server member list so add them
            await databasefunctions.AddMemberToServer(firedb, message.guild.id, message.author.id, message.author.username);
        }
    } else {
        // Server does not exist in filter database so add it
        const channelList = await message.guild.channels.cache.values();
        const guild = await client.guilds.resolve(message.guild);
        const memberList = await guild.members.fetch().catch(console.error);

        databasefunctions.InitializeNewServer(firedb, message.guild.id, channelList, memberList);
    }
}

module.exports = { FilterMessage };

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
                    await messagefunctions.send_message(
                        firedb,
                        message.author,
                        "The word '" +
                            wordFiltered +
                            "' is not allowed in " +
                            message.guild.name +
                            '. Please refrain from using it in the future. Thank you!'
                    );
                    await messagefunctions.delete_message(firedb, message, true, client, 'auto filter');
                    const penalty = await databasefunctions.IncrementUserFilterViolations(firedb, message.guild.id, message.author.id);
                    await databasefunctions.IncrementServerFilteredMessages(firedb, message.guildId, 1);

                    if (penalty) {
                        const serverPenalty = await databasefunctions.GetServerPenalty(firedb, message.guild.id);
                        switch (serverPenalty) {
                            case 'mute':
                                await MuteUser(firedb, message, client);
                                break;
                            case 'kick':
                                await KickUser(firedb, message, client);
                                break;
                            case 'ban':
                                await BanUser(firedb, message, client);
                                break;
                        }
                    }
                }
            }
        }
        if (!serverFilterInfo.channels[message.channel.id]) {
            // Channel is not in the server channel list so add it
            const channel = await discordfunctions.GetChannel(client, message.channel.id);
            await databasefunctions.AddChannelToServer(firedb, message.guild.id, message.channel.id, channel.name);
        }
        if (!serverFilterInfo.members[message.author.id]) {
            // User is not in the server member list so add them
            await databasefunctions.AddMemberToServer(
                firedb,
                message.guild.id,
                message.author.id,
                message.author.username
            );
        }
    } else {
        // Server does not exist in filter database so add it
        const channelList = await message.guild.channels.cache.values();
        const guild = await client.guilds.resolve(message.guild);
        const memberList = await guild.members.fetch().catch(console.error);

        databasefunctions.InitializeNewServer(firedb, message.guild.id, channelList, memberList);
    }
}

async function MuteUser (firedb, message, client) {
        const member = message.guild.members.cache.get(message.author.id);

        const mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');

        if (!mutedRole) return messagefunctions.server_log(firedb, client, message.guild.id, `Attempted to mute <@${message.author.id}> for 
            exceding the maximum number of filter violations but could not becasue no "Muted" role exists`);

        let roles = await discordfunctions.GetAllMemberRoles(member, message.guild.id);

        await databasefunctions.SetCloudData(firedb, 'muted', member.id + '-' + message.guild.id, {
            roles: roles,
        });

        for (let i = 0; i < roles.length; i++) {
            const role = await discordfunctions.GetRole(client, message.guild.id, roles[i]);
            member.roles.remove(role);
        }

        await member.roles.add(mutedRole);

        await messagefunctions.server_log(firedb, client, message.guild.id, `Muted <@${member.id}> for exceding maximum filter violations. 
            Unmute using the unmute command to restore user roles. To reduce/increase this penalty in the future, use the "setpenalty" command.`);
}

async function KickUser(firedb, message, client) {
    const memberTarget = await message.guild.members.cache.get(message.author.id);
    if (!memberTarget.kickable) {
        await messagefunctions.server_log(firedb, client, message.guild.id, `Attempted to kick <@${message.author.id}> for exceding maximum filter violations but the user is not able to be kicked.`)
        return;
    }
    await memberTarget.kick();
    await messagefunctions.send_message(
        firedb,
        message.author,
        'You have been kicked from ' + message.guild.name + ' for exceding the maximum number of filter violations.'
    );
                        await messagefunctions.server_log(
                            firedb,
                            client,
                            message.guild.id,
                            `<@${message.author.id}> has been kicked due to exceding maximum filter violations. To reduce/increase this penalty in the future, use the "setpenalty" command.`
                        );
}

async function BanUser(firedb, message, client) {
    const memberTarget = await message.guild.members.cache.get(message.author.id);
    if (!memberTarget.bannable) {
        await messagefunctions.server_log(firedb, client, message.guild.id, `Attempted to ban <@${message.author.id}> for exceding maximum filter violations but the user is not able to be banned.`)
        return;
    }
    await memberTarget.ban();
    await messagefunctions.send_message(
        firedb,
        message.author,
        'You have been banned from ' + message.guild.name + ' for exceding the maximum number of filter violations.'
    );
                        await messagefunctions.server_log(
                            firedb,
                            client,
                            message.guild.id,
                            `<@${message.author.id}> has been banned due to exceding maximum filter violations. To reduce/increase this penalty in the future, use the "setpenalty" command.`
                        );
}

module.exports = { FilterMessage };

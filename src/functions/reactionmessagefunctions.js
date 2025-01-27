const fire = require('firebase/firestore');
const discordfunctions = require('../functions/discordfunctions.js');
const databasefunctions = require('./databasefunctions.js');
const logging = require('./logging.js');
const messages = require('./messages.js');

async function StoreReactionMessage(firedb, guildId, channelId, messageId, role1, role2, role3, role4, role5) {
    const reactionMessageInfo = {
        guild_id: guildId,
        channel_id: channelId,
        message_id: messageId,
        role_1: role1,
        role_2: role2,
        role_3: role3,
        role_4: role4,
        role_5: role5,
    };

    await databasefunctions.SetCloudData(firedb, 'reaction_role_messages', messageId, reactionMessageInfo);
}

async function SetupOldReactionMessages(firedb, client) {
    try {
        const messages = fire.query(fire.collection(firedb, 'reaction_role_messages'));

        const querySnapshot = await fire.getDocs(messages);
        querySnapshot.forEach(async doc => {
            const messageId = doc.id;
            const messageInfo = doc.data();

            const message = await discordfunctions.GetMessage(client, messageInfo.message_id, messageInfo.channel_id);

            // Delete message from database if it does not exist
            if (!message) {
                databasefunctions.DeleteFirebaseDocument(firedb, 'reaction_role_messages', messageId);
                databasefunctions.DecrementReactionRoleMessageCount(firedb, messageInfo.guild_id);
                return;
            }

            const role1 = await discordfunctions.GetRole(client, message.guild.id, messageInfo.role_1);
            const role2 = await discordfunctions.GetRole(client, message.guild.id, messageInfo.role_2);
            const role3 = await discordfunctions.GetRole(client, message.guild.id, messageInfo.role_3);
            const role4 = await discordfunctions.GetRole(client, message.guild.id, messageInfo.role_4);
            const role5 = await discordfunctions.GetRole(client, message.guild.id, messageInfo.role_5);

            await FetchAndStartReactionMessage(firedb, client, message, role1, role2, role3, role4, role5);
        });
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function FetchAndStartReactionMessage(firedb, client, message, role1, role2, role3, role4, role5) {
    await CreateComponentCollector(firedb, client, message, role1, role2, role3, role4, role5);
}

async function CreateComponentCollector(firedb, client, message, role1, role2, role3, role4, role5) {
    const collector = await message.createMessageComponentCollector();

    collector.on('collect', async reaction => {
        await HandleReaction(firedb, client, reaction, role1, role2, role3, role4, role5);
    });
}

async function HandleReaction(firedb, client, reaction, role1, role2, role3, role4, role5) {
    await databasefunctions.IncrementDaily(firedb, 1, 'messaging', 'reaction_collections');

    const member = reaction.member;
    const serverId = reaction.guildId;
    const userId = reaction.user.username;

    if (
        (role1 && reaction.guild.members.me.roles.highest.position < role1.position) ||
        (role2 && reaction.guild.members.me.roles.highest.position < role2.position) ||
        (role3 && reaction.guild.members.me.roles.highest.position < role3.position) ||
        (role4 && reaction.guild.members.me.roles.highest.position < role4.position) ||
        (role5 && reaction.guild.members.me.roles.highest.position < role5.position)
    ) {
        reaction.update({
            content: "My role is below the roles that I'm trying to give. I have shut the message reaction down",
            ephemeral: true,
        });
        return;
    }

    if (reaction.customId === 'button1') {
        if (await member.roles.cache.some(r => r.name === role1.name)) {
            member.roles.remove(role1);
            reaction.reply({ content: `You have removed the role : ${role1.name}`, ephemeral: true });
            await HandleRoleRemoveLog( firedb, client, serverId, userId, role1.name);
        } else {
            member.roles.add(role1);
            reaction.reply({ content: `You have added the role : ${role1.name}`, ephemeral: true });
            await HandleRoleAddLog( firedb, client, serverId, userId, role1.name);
        }
    }

    if (reaction.customId === 'button2') {
        if (await member.roles.cache.some(r => r.name === role2.name)) {
            member.roles.remove(role2);
            reaction.reply({ content: `You have removed the role : ${role2.name}`, ephemeral: true });
            await HandleRoleRemoveLog( firedb, client, serverId, userId, role2.name);
        } else {
            member.roles.add(role2);
            reaction.reply({ content: `You have added the role : ${role2.name}`, ephemeral: true });
            await HandleRoleAddLog( firedb, client, serverId, userId, role2.name);
        }
    }

    if (reaction.customId === 'button3') {
        if (await member.roles.cache.some(r => r.name === role3.name)) {
            member.roles.remove(role3);
            reaction.reply({ content: `You have removed the role : ${role3.name}`, ephemeral: true });
            await HandleRoleRemoveLog( firedb, client, serverId, userId, role3.name);
        } else {
            member.roles.add(role3);
            reaction.reply({ content: `You have added the role : ${role3.name}`, ephemeral: true });
            await HandleRoleAddLog( firedb, client, serverId, userId, role3.name);
        }
    }

    if (reaction.customId === 'button4') {
        if (await member.roles.cache.some(r => r.name === role4.name)) {
            member.roles.remove(role4);
            reaction.reply({ content: `You have removed the role : ${role4.name}`, ephemeral: true });
            await HandleRoleRemoveLog( firedb, client, serverId, userId, role4.name);
        } else {
            member.roles.add(role4);
            reaction.reply({ content: `You have added the role : ${role4.name}`, ephemeral: true });
            await HandleRoleAddLog( firedb, client, serverId, userId, role4.name);
        }
    }

    if (reaction.customId === 'button5') {
        if (await member.roles.cache.some(r => r.name === role5.name)) {
            member.roles.remove(role5);
            reaction.reply({ content: `You have removed the role : ${role5.name}`, ephemeral: true });
            await HandleRoleRemoveLog( firedb, client, serverId, userId, role5.name);
        } else {
            member.roles.add(role5);
            reaction.reply({ content: `You have added the role : ${role5.name}`, ephemeral: true });
            await HandleRoleAddLog( firedb, client, serverId, userId, role5.name);
        }
    }
}

async function HandleRoleAddLog( firedb, client, serverId, userId, roleId ) {
    await databasefunctions.GetServerReactionLogging(firedb, serverId) ? await messages.server_log(firedb, client, serverId, `**${userId}** has added the **${roleId}** role`) : '';
}

async function HandleRoleRemoveLog( firedb, client, serverId, userId, roleId) {
    await databasefunctions.GetServerReactionLogging(firedb, serverId) ? await messages.server_log(firedb, client, serverId, `**${userId}** has removed the **${roleId}** role`) : '';
}

module.exports = {
    StoreReactionMessage,
    SetupOldReactionMessages,
    FetchAndStartReactionMessage,
    HandleReaction,
    CreateComponentCollector,
};

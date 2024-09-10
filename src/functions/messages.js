const databasefunctions = require('./databasefunctions.js');
const discordfunctions = require('./discordfunctions.js');
const logging = require('./logging.js');

async function send_message(firedb, channel, content) {
    if (!channel) {
        logging.log(firedb, 'messages.js: Must include channel to send to');
    }

    try {
        await databasefunctions.IncrementDaily(firedb, 1, 'messaging', 'messages_sent');
        return await channel.send(content);
    } catch (error) {
        console.error(error);
    }
}

async function edit_message(message, content) {
    if (!message) {
        logging.log(firedb, 'messages.js: Must include message to edit');
    }

    try {
        return await message.edit(content);
    } catch (error) {
        console.error(error);
    }
}

async function send_reply(firedb, message, content, replyUser = true) {
    if (!message) {
        logging.log(firedb, 'messages.js: Must include message to reply to');
    }

    try {
        await databasefunctions.IncrementDaily(firedb, 1, 'messaging', 'messages_sent');

        if (!(await discordfunctions.GetMessageWithMessage(message.id, message))) return;

        return message.channel.send({
            content,
            reply: { messageReference: message.id },
            allowedMentions: { repliedUser: replyUser },
        });
    } catch (error) {
        console.error(error);
    }
}

async function delete_message(firedb, message, log = false, client = undefined, trigger = '') {
    if (!message) {
        logging.log(firedb, 'messages.js: Must include message to reply to');
    }

    try {
        await databasefunctions.IncrementDaily(firedb, 1, 'messaging', 'messages_deleted');
        if (log && client && trigger) {
            server_log(
                firedb,
                client,
                message.guild.id,
                `The message: **"` +
                    message.content +
                    `"** was deleted from <#${message.channelId}> and was sent by <@${message.author.id}>. Trigger was ` +
                    trigger
            );
        }
        return message.delete();
    } catch (error) {
        console.error(error);
    }
}

async function server_log(firedb, client, serverId, content) {
    try {
        let channelId = await databasefunctions.GetLogChannel(firedb, serverId);
        if (channelId === '') return; // Server does not have a logging channel defined
        let logChannel = await discordfunctions.GetChannel(client, channelId);
        if (!logChannel) return;
        await send_message(firedb, logChannel, content);
    } catch (error) {
        logging.error(firedb, error);
    }
}

module.exports = { send_message, edit_message, send_reply, delete_message, server_log };

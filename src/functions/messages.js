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

async function delete_message(firedb, message) {
    if (!message) {
        logging.log(firedb, 'messages.js: Must include message to reply to');
    }

    try {
        await databasefunctions.IncrementDaily(firedb, 1, 'messaging', 'messages_deleted');
        return message.delete();
    } catch (error) {
        console.error(error);
    }
}

module.exports = { send_message, edit_message, send_reply, delete_message };

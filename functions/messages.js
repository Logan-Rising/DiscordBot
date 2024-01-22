const databasefunctions = require('./databasefunctions.js');

async function send_message(firedb, channel, content) {
    if (!channel) {
        console.log('messages.js: Must include channel to send to');
    }

    try {
        await databasefunctions.IncrementMessageSent(firedb, 1);
        return channel.send(content);
    } catch (error) {
        console.error(error);
    }
}

async function send_reply(firedb, message, content) {
    if (!message) {
        console.log('messages.js: Must include message to reply to');
    }

    try {
        await databasefunctions.IncrementMessageSent(firedb, 1);
        return message.channel.send({content, reply: {messageReference: message.id}})
    } catch (error) {
        console.error(error);
    }
}

async function delete_message(firedb, message) {
    if (!message) {
        console.log('messages.js: Must include message to reply to');
    }

    try {
        await databasefunctions.IncrementMessagesDeleted(firedb, 1);
        return message.delete();
    } catch (error) {
        console.error(error);
    }
}

module.exports = { send_message, send_reply, delete_message };

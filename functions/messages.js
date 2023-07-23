const firebasefunctions = require('./firebasefunctions.js');

async function send_message(firedb, channel, content) {
    if (!channel) {
        console.log('messages.js: Must include channel to send to');
    }

    try {
        await firebasefunctions.IncrementMessageSent(firedb, 1);
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
        await firebasefunctions.IncrementMessageSent(firedb, 1);
        return message.lineReply(content);
    } catch (error) {
        console.error(error);
    }
}

module.exports = { send_message, send_reply };

function send_message(channel, content) {
    if (!channel) {
        console.log('messages.js: Must include channel to send to');
    }

    try {
        return channel.send(content);
    } catch (error) {
        console.error(error);
    }
}

function send_reply(message, content) {
    if (!message) {
        console.log('messages.js: Must include message to reply to');
    }

    try {
        message.lineReply(content);
    } catch (error) {
        console.error(error);
    }
}

async function slash_command(message, content) {
    try {
        await message.reply('Hi');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { send_message, send_reply, slash_command };

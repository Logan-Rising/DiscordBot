const fs = require('fs');
const canvasGif = require('canvas-gif');
const path = require('path');
const constants = require('../constants/constants.js');
const messages = require('../functions/messages.js');
const discordfunctions = require('../functions/discordfunctions.js');

async function onKickBan(firedb, name, channel, id) {
    messages.send_message(firedb, channel, `<@${id}> got Thanos snapped <a:dusted:846409553829953556>`)
    const callBack = (context, width, height, totalFrames, currentFrame) => {
        context.fillStyle = '#FFA500';
        context.font = '30px "Sans"';
        context.fillText(name, 40, 225);
    };

    let options = {
        coalesce: false,
        delay: 0,
        repeat: 0,
        algorithm: 'neuquant',
        optimiser: true,
        fps: 20,
        quality: 100,
    };

    canvasGif(path.join(__dirname, 'kick.gif'), callBack, options)
        .then(buffer => fs.writeFileSync(path.resolve(__dirname, 'output.gif'), buffer))
        .catch(error => {
            console.log(error);
        });

    await new Promise(resolve => setTimeout(resolve, 5000));
    const file = { files: [constants.kickGifPath] };
    if (file) {
        messages.send_message(firedb, channel, file);
        await new Promise(resolve => setTimeout(resolve, 5000));
        fs.unlink(constants.kickGifPath, err => {
            if (err) {
                console.log('fs unnlink error');
            }
        });
    } else messages.send_message(firedb, channel, 'Internal image error ocurred');
    return;
}

async function onStartup(client, firedb) {
    // Console log message
    console.log(`${client.user.tag} has logged in!`);

    // Send message every interval in #m in Freddy's server
    setInterval(async () => {
        const channel = await discordfunctions.GetChannel(client, '777785944513576961');
        messages.send_message(firedb, channel, 'm');
        // channel.send('m');
    }, 28800000);

    // Log bot online in log channel
    const logChannel = await discordfunctions.GetChannel(client, constants.logChannelId);
    // logChannel.send(`${client.user.tag} has logged in!`);
    messages.send_message(firedb, logChannel, `${client.user.tag} has logged in!`);

    return;
}

async function CheckMessage(message) {
    
}

module.exports = {
    onKickBan,
    onStartup,
    CheckMessage,
};

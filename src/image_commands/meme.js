const databasefunctions = require('../functions/databasefunctions.js');
const discordfunctions = require('../functions/discordfunctions.js');
const messages = require('../functions/messages.js');
const utilities = require('../functions/utilities.js');
const logging = require('../functions/logging.js');
const fs = require('fs');
const Jimp = require('jimp');

module.exports = {
    name: 'meme',
    description: 'Makes a meme with text as in the decription when the command was ran. Uses image sent with the message or image from the message replied to.',
    users: [],
    servers: [],
    syntax: '&meme [!black] <description>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        // Replied to another message so find the image in the replied to message
        if (message.type === 19) {
            message = await discordfunctions.GetMessage(
                client,
                message.reference.messageId,
                message.reference.channelId
            );
        }

        let memeCaption = '';
        let length = 0;
        let black = false;
        let i = 0;
        const width = 256;
        const height = 256;

        // Check if the user wants the text black
        if (args[0].toLowerCase() === '!black') {
            black = true;
            i = 1;
        } else if (args[0].toLowerCase() === '!white') {
            i = 1;
        }

        let fontTitle = black ? Jimp.FONT_SANS_32_BLACK : Jimp.FONT_SANS_32_WHITE;

        // Set meme description and track length
        for (i; i < args.length; i++) {
            memeCaption += args[i] + (i !== args.length ? ' ' : '');
            length += args[i].length + 1;
        }

        // Adjust font sizing based on length of meme text
        if (length > 16 && length <= 90 && !black) {
            fontTitle = Jimp.FONT_SANS_16_WHITE;
        } else if (length > 90 && !black) {
            fontTitle = Jimp.FONT_SANS_8_WHITE;
        } else if (length > 16 && length <= 90 && black) {
            fontTitle = Jimp.FONT_SANS_16_BLACK;
        } else if (length > 90 && black) {
            fontTitle = Jimp.FONT_SANS_8_BLACK;
        }

        const font = await Jimp.loadFont(fontTitle);

        // Create a identifier for this image
        // Not unique but close, 1/1000 for a number, 1/1,000,000 for the same number twice in a row
        const id = Math.floor(Math.random() * 1000);

        const fileIdName = 'image_' + id + '.jpg';

        message.attachments.forEach(attachment => {
            Jimp.read({
                url: attachment.proxyURL,
            })
                .then(async image => {
                    image
                        .resize(width, height)
                        .print(
                            font,
                            0,
                            height / 20,
                            {
                                text: memeCaption,
                                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            },
                            width,
                            height
                        )
                        .write(fileIdName);

                    await utilities.WaitForFile(fileIdName, 1000);
                    await messages.send_message(firedb, message.channel, { files: [fileIdName] });

                    // Delete the image
                    fs.unlink(fileIdName, error => {
                        if (error) {
                            logging.error(firedb, error);
                            return;
                        }
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        });

        return;
    },
};

const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');
const utilities = require('../functions/utilities.js');
const logging = require('../functions/logging.js');
const fs = require('fs');
const Jimp = require('jimp');

module.exports = {
    name: 'meme',
    description: '',
    users: [],
    servers: [],
    syntax: '&meme <description>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        let memeCaption = '';

        // Set meme description
        for (i = 0; i < args.length; i++) {
            memeCaption += args[i] + ' ';
        }

        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

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
                        .print(
                            font,
                            0,
                            0,
                            {
                                text: memeCaption,
                                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                                alignmentY: Jimp.VERTICAL_ALIGN_CENTER,
                            },
                            image.bitmap.width,
                            image.bitmap.height
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

const download = require('image-downloader');
const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');
const logging = require('../functions/logging.js');

module.exports = {
    name: 'addimage',
    description: 'Adds an image to the repository of photos with the specified name',
    users: constants.Image_Permissions,
    servers: constants.Image_Servers,
    syntax: '&addimage <name>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        var name = args[0];

        var total = 0;

        var num = await databasefunctions.GetIndex(firedb, 'images', name);

        // Name is not in the database (not been initialized)
        if (num === undefined) {
            messages.send_reply(firedb, message, 'Invalid name');
            return;
        }

        message.attachments.forEach(attachment => {
            total++;
            var fileDestination = constants.imagesFilePath;
            fileDestination += name + '/' + name + '_' + num + '.jpg';
            num = num + 1;

            const ImageLink = attachment.proxyURL;
            //logging.log(firedb, `\`${ImageLink}\``)

            options = {
                url: ImageLink,
                dest: fileDestination, // will be saved to /path/to/dest/photo.jpg
            };

            download
                .image(options)
                .then(({ filename }) => {
                    logging.log(firedb, 'Saved to', filename); // saved to /path/to/dest/photo.jpg
                })
                .catch(err => console.error(err));
        });

        if (total === 0) {
            messages.send_reply(firedb, message, 'No images were attached');
        } else {
            messages.send_message(firedb, message.channel, 'Successfully saved ' + total + ' images!');
        }

        await databasefunctions.SetIndex(firedb, num, 'images', name);
    },
};

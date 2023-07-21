const download = require('image-downloader');
const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'addimage',
    description: 'Adds an image to the repository of photos with the specified name',
    users: constants.Image_Permissions,
    servers: constants.Image_Servers,
    syntax: '&addimage <name>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        var name = args[0];

        var total = 0;

        var num = await firebasefunctions.GetImageIndex(name, firedb);

        // Name is not in the database (not been initialized)
        if (num === undefined) {
            messages.send_reply(message, 'Invalid name');
            return;
        }

        message.attachments.forEach(attachment => {
            total++;
            var fileDestination = constants.imagesFilePath;
            fileDestination += name + '/' + name + '_' + num + '.jpg';
            num = num + 1;

            const ImageLink = attachment.proxyURL;
            //console.log(`\`${ImageLink}\``)

            options = {
                url: ImageLink,
                dest: fileDestination, // will be saved to /path/to/dest/photo.jpg
            };

            download
                .image(options)
                .then(({ filename }) => {
                    console.log('Saved to', filename); // saved to /path/to/dest/photo.jpg
                })
                .catch(err => console.error(err));
        });

        if (total === 0) {
            messages.send_reply(message, 'No images were attached');
        } else {
            messages.send_message(message.channel, 'Successfully saved ' + total + ' images!');
        }

        await firebasefunctions.SetImageIndex(name, num, firedb);
    },
};

const fs = require('fs');
const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'deleteimage',
    description: 'deletes image(s) from the repository of photos',
    users: constants.Image_Permissions,
    servers: constants.Image_Servers,
    syntax: '&deleteimage <name> [number to delete]',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        var name = args[0];

        if (!(await firebasefunctions.CheckIfImageNameExists(firedb, name))) {
            return;
        }

        // How many images to delete
        var counter;
        if (!args[1]) counter = 1;
        else if (Number.isNaN(parseInt(args[1])))
            return messages.send_reply(message, 'Must enter a number (default is 1) not: ' + args[1]);
        else counter = parseInt(args[1]);

        let return_counter = counter;
        var num = await firebasefunctions.GetImageIndex(name, firedb);
        console.log('num: ', num);

        if (num === -1 || Number.isNaN(num)) {
            messages.send_reply(message, 'Internal Error: Could Not Fetch Image Index');
            return;
        }

        for (counter; counter > 0; counter--) {
            var path = constants.imagesFilePath;
            num = num - 1;
            path += name + '/' + name + '_' + num + '.jpg';

            // Delete the image
            fs.unlink(path, err => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            console.log(path + ' deleted'); // Log image deleted
        }

        firebasefunctions.SetImageIndex(name, num, firedb);
        messages.send_message(message.channel, 'Successfully deleted ' + return_counter + ' images!');
    },
};

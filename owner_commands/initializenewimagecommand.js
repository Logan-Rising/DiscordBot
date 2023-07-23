const fs = require('fs');
const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'initializenewcommand',
    users: [constants.ownerId],
    servers: [],
    description: 'Add a new command to the bot',
    syntax: '&initializenewimagecommand <command name> <type>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        if (!args[0] || !args[1] || args[2]) {
            messages.send_reply(firedb, message, 'Must input name and type. Syntax: ' + this.syntax);
            return;
        }

        var name = args[0];
        var type = args[1].toLowerCase();

        // Check if command name already exists in the database
        if (await firebasefunctions.GetImageUsage(name, firedb) !== -1) {
            messages.send_reply(firedb, message, 'Name already exists: Database');
            return;
        }

        var path = '';

        switch (type) {
            case 'image':
                path = './image_commands/' + name + '.js';
                break;
            case 'custom':
                path = './custom_commands/' + name + '.js';
                break;
            default:
                messages.send_reply(firedb, message, 'Type not recognized. Valid types are: image and custom.');
                return;
        }

        if (fs.existsSync(path)) {
            messages.send_reply(firedb, message, 'Name already exists: File Location');
            return;
        }

        // All conditional criteria is met so go ahead and write the file

        const message_string =
        'const constants = require(\'../functions/firebasefunctions.js\');' + '\n' + 
        '\n' +
        'module.exports = {' + '\n' +
        '    name: \'' + name + '\',' + '\n' +
        '    description: \'\',' + '\n' +
        '    users: [],' + '\n' +
        '    servers: [],' + '\n' +
        '    syntax: \'&' + name + '\',' + '\n' +
        '    async execute(client, message, args, Discord, firedb) {' + '\n' +
        '        firebasefunctions.IncrementImageUsage(this.name, firedb, 1);' + '\n' + 
        '\n' +
        '        images.GetImage(message, this.name, firedb);' + '\n' +
        '    },' + '\n' +
        '};' + '\n';



        const success = await firebasefunctions.InitializeImage(name, firedb);

        if (!success) {
            messages.send_reply(firedb, message, 'Failed to initialize ' + name + ' in the database');
        }

        // Everything initialized correctly so write to the file
        fs.appendFile(path, message_string, err => {
            if (err) {
                console.error(err);
            }
            messages.send_message(firedb, message.channel, 'Successfully wrote new image command.');
        });
        return;
    },
};

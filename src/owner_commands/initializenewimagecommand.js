const fs = require('fs');
const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../assets/config.js');
const logging = require('../functions/logging.js');

module.exports = {
    name: 'initializenewimagecommand',
    users: [constants.ownerId],
    servers: [],
    description: 'Add a new command to the bot',
    syntax: '&initializenewimagecommand <command name> <type>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        if (!args[0] || !args[1] || args[2]) {
            messages.send_reply(firedb, message, 'Must input name and type. Syntax: ' + this.syntax);
            return;
        }

        var name = args[0];
        var type = args[1].toLowerCase();

        // Check if command name already exists in the database
        if ((await databasefunctions.GetImageUsage(name, firedb)) !== -1) {
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
            "const constants = require('../functions/databasefunctions.js');" +
            '\n' +
            '\n' +
            'module.exports = {' +
            '\n' +
            "    name: '" +
            name +
            "'," +
            '\n' +
            "    description: ''," +
            '\n' +
            '    users: [],' +
            '\n' +
            '    servers: [],' +
            '\n' +
            "    syntax: '&" +
            name +
            "'," +
            '\n' +
            '    async execute(client, message, args, Discord, firedb) {' +
            '\n' +
            '        databasefunctions.IncrementImageUsage(this.name, firedb, 1);' +
            '\n' +
            '\n' +
            '        images.GetImage(message, this.name, firedb);' +
            '\n' +
            '    },' +
            '\n' +
            '};' +
            '\n';

        const success = await databasefunctions.InitializeImage(name, firedb);

        if (!success) {
            messages.send_reply(firedb, message, 'Failed to initialize ' + name + ' in the database');
        }

        // Everything initialized correctly so write to the file
        fs.appendFile(path, message_string, error => {
            if (error) {
                logging.error(firedb, error);
            }
            messages.send_message(firedb, message.channel, 'Successfully wrote new image command.');
        });
        return;
    },
};

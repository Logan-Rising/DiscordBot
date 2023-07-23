const fs = require('fs');
const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'initializenewcommand',
    users: [constants.ownerId],
    servers: [],
    description: 'Add a new command to the bot',
    syntax: '&initializenewcommand <command name> <type>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        if (!args[0] || !args[1] || args[2]) {
            messages.send_reply(firedb, message, 'Must input name and type. Syntax: ' + this.syntax);
            return;
        }

        var name = args[0];
        var type = args[1].toLowerCase();

        // Check if command name already exists in the database
        if (await firebasefunctions.GetCommandCount(name, firedb) !== -1) {
            messages.send_reply(firedb, message, 'Name already exists: Database');
            return;
        }

        var path = '';

        switch (type) {
            case 'general':
                path = './general_commands/' + name + '.js';
                break;
            case 'admin':
                path = './admin_commands/' + name + '.js';
                break;
            case 'game':
                path = './game_commands/' + name + '.js';
                break;
            case 'image':
                path = './image_commands/' + name + '.js';
                break;
            case 'custom':
                path = './custom_commands/' + name + '.js';
                break;
            default:
                messages.send_reply(firedb, message, 'Type not recognized. Valid types are: admin, general, game, image, and custom.');
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
        '        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);' + '\n' + 
        '\n' +
        '        return;' + '\n' +
        '    },' + '\n' +
        '};' + '\n';

        const success = await firebasefunctions.InitializeCommand(name, type, firedb);

        if (!success) {
            messages.send_reply(firedb, message, 'Failed to initialize ' + name + ' in the database');
        }

        // Everything initialized correctly so write to the file
        fs.appendFile(path, message_string, err => {
            if (err) {
                console.error(err);
            }
            messages.send_message(firedb, message.channel, 'Successfully wrote new command.');
        });
        return;
    },
};

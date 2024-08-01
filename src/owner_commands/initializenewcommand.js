const fs = require('fs');
const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../assets/config.js');
const logging = require('../functions/logging.js');

module.exports = {
    name: 'initializenewcommand',
    users: [constants.ownerId],
    servers: [],
    description: 'Add a new command to the bot',
    syntax: '&initializenewcommand <command name> <type>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        if (!args[0] || !args[1] || args[2]) {
            messages.send_reply(firedb, message, 'Must input name and type. Syntax: ' + this.syntax);
            return;
        }

        var name = args[0];
        var type = args[1].toLowerCase();

        // Check if command name already exists in the database
        if ((await databasefunctions.GetIndex(firedb, 'commands', name)) !== -1) {
            messages.send_reply(firedb, message, 'Name already exists: Database');
            return;
        }

        var path = '';

        switch (type) {
            case 'general':
                path = './src/general_commands/' + name + '.js';
                break;
            case 'admin':
                path = './src/admin_commands/' + name + '.js';
                break;
            case 'game':
                path = './src/game_commands/' + name + '.js';
                break;
            case 'image':
                path = './src/image_commands/' + name + '.js';
                break;
            case 'custom':
                path = './src/custom_commands/' + name + '.js';
                break;
            case 'owner':
                path = './src/owner_commands/' + name + '.js';
                break;
            default:
                messages.send_reply(
                    firedb,
                    message,
                    'Type not recognized. Valid types are: admin, general, game, image, and custom.'
                );
                return;
        }

        if (fs.existsSync(path)) {
            messages.send_reply(firedb, message, 'Name already exists: File Location');
            return;
        }

        // All conditional criteria is met so go ahead and write the file

        const message_string =
            "const databasefunctions = require('../functions/databasefunctions.js');" +
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
            "        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);" +
            '\n' +
            '\n' +
            '        return;' +
            '\n' +
            '    },' +
            '\n' +
            '};' +
            '\n';

        const success = await databasefunctions.InitializeCommand(name, type, firedb);

        if (!success) {
            messages.send_reply(firedb, message, 'Failed to initialize ' + name + ' in the database');
        }

        // Everything initialized correctly so write to the file
        fs.appendFile(path, message_string, error => {
            if (error) {
                console.log('Error writing file');
                logging.error(firedb, error);
            }
            messages.send_message(firedb, message.channel, 'Successfully wrote new command.');
        });
        return;
    },
};

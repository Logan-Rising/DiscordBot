const fs = require('fs');

module.exports = (client, Discord, firedb) => {
    const command_files = fs.readdirSync('./custom_commands/').filter(file => file.endsWith('.js'));

    for (const file of command_files) {
        const command = require(`../../custom_commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
        } else if (command.data.name) {
            client.commands.set(command.data.name, command);
        } else {
            continue;
        }
    }
};

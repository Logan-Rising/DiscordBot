const fs = require('fs');

module.exports = (client, Discord, firedb) => {
    const command_files = fs.readdirSync('./game_commands/').filter(file => file.endsWith('.js'));

    for (const file of command_files) {
        const command = require(`../game_commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
        } else {
            continue;
        }
    }
};

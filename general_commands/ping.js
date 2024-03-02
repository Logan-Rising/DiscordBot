const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');

module.exports = {
    name: 'ping',
    description: 'Pings a response',
    users: [],
    servers: [],
    syntax: '&ping',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        messages.send_message(firedb, message.channel, 'pong!');
    },
};

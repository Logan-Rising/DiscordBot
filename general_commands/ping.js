const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');

module.exports = {
    name: 'ping',
    description: 'Pings a response',
    users: [],
    servers: [],
    syntax: '&ping',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        messages.send_message(firedb, message.channel, 'pong!');
    },
};

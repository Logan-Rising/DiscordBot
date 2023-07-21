const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');

module.exports = {
    name: 'ping',
    description: 'Pings a response',
    users: [],
    servers: [],
    syntax: '&ping',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        messages.send_message(message.channel, 'pong!');
    },
};

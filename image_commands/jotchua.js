const firebasefunctions = require('../functions/firebasefunctions.js');
const images = require('../functions/images.js');

module.exports = {
    name: 'jotchua',
    description: 'Send a random pic of jotchua the beloved',
    users: [],
    servers: [],
    syntax: '&jotchua',
    async execute(client, message, args, Discord, firedb) {
        firebasefunctions.IncrementImageUsage(this.name, firedb, 1);

        images.GetImage(message, this.name, firedb);
    },
};

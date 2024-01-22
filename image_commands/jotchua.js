const databasefunctions = require('../functions/databasefunctions.js');
const images = require('../functions/images.js');

module.exports = {
    name: 'jotchua',
    description: 'Send a random pic of jotchua the beloved',
    users: [],
    servers: [],
    syntax: '&jotchua',
    async execute(client, message, args, Discord, firedb) {
        databasefunctions.IncrementImageUsage(this.name, firedb, 1);

        images.GetImage(message, this.name, firedb);
    },
};

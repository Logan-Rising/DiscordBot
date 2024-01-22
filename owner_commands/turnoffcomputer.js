/* Windows Only */

const { exec } = require('child_process');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'turnoffcomputer',
    description: 'Turns off the host pc',
    users: [constants.ownerId],
    servers: [],
    syntax: '&turnoffcomputer',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementCommandCount(this.name, 1, firedb);

        if (process.platform === 'win32') exec('shutdown /s');
        else return;
    },
};

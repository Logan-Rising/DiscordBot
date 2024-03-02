/* Windows Only */

const { exec } = require('child_process');
const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');

module.exports = {
    name: 'turnoffcomputer',
    description: 'Turns off the host pc',
    users: [constants.ownerId],
    servers: [],
    syntax: '&turnoffcomputer',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementIndex(firedb, 1, 'commands', this.name);

        if (process.platform === 'win32') exec('shutdown /s');
        else return;
    },
};

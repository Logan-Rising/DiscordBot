const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const package = require('../package.json');
const constants = require('../constants.js');
module.exports = {
    name: 'dependencies',
    description: 'Returns the packages used in the discord bot',
    users: [],
    servers: [],
    syntax: '&dependencies',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        let dependencies_string = "";

        for (const pkg in package.dependencies) {
            dependencies_string += `${pkg}:${package.dependencies[pkg]}` + '\n';
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#BFCDEB')
            .setTitle(constants.botName + ' Dependencies')
            .setDescription(dependencies_string);

        messages.send_message(firedb, message.channel, embed);
    },
};

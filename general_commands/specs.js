const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');
const constants = require('../constants.js');

module.exports = {
    name: 'specs',
    description: 'Returns the specs of the computer that runs the discord bot',
    users: [],
    servers: [],
    syntax: '&specs',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        if (!constants.specs.specsString || !constants.specs.specsPhoto || !constants.botName) {
            return;
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#BFCDEB')
            .setTitle(constants.botName + ' Specs')
            .setDescription(constants.specs.specsString)
            .setImage(constants.specs.specsPhoto);

        messages.send_message(message.channel, embed);
    },
};

const messages = require('../functions/messages.js');
const databasefunctions = require('../functions/databasefunctions.js');
module.exports = {
    name: '8ball',
    description: 'Recieve a randomly generated 8-ball phrase in response to a message',
    users: [],
    servers: [],
    syntax: '&8ball <message>',
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        var eight_ball = [
            'It is certain',
            'It is decidedly so',
            'Without a doubt',
            'Yes - definitely',
            'You may rely on it',
            'Ah I see it, yes',
            'Most likely',
            'Outlook good',
            'Yes',
            'Signs point to yes',
            'Reply hazy, try again',
            'Ask again later',
            'Better not tell you now',
            'Cannot predict now',
            'Concentrate and ask again',
            "Don't count on it",
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful',
        ];
        messages.send_reply(firedb, message, eight_ball[Math.floor(Math.random() * eight_ball.length)]);
    },
};

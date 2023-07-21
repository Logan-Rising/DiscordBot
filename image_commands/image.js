var Scraper = require('images-scraper');
const messages = require('../functions/messages.js');
const firebasefunctions = require('../functions/firebasefunctions.js');

const google = new Scraper({
    puppeteer: {
        headless: true,
    },
});

module.exports = {
    name: 'image',
    description: 'Sends a random image based on the provided query',
    users: [],
    servers: [],
    syntax: '&image <query>',
    async execute(client, message, args) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const image_query = args.join(' ');
        if (!image_query) return messages.send_message(message.channel, 'Please enter an image name');

        const image_results = await google.scrape(image_query, 200);
        messages.send_message(message.channel, image_results[Math.floor(Math.random() * image_results.length)].url);
    },
};

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
    description: 'Sends a random image based on the provided query via image scaping the web.',
    users: [],
    servers: [],
    syntax: '&image <query>',
    async execute(client, message, args, Discord, firedb) {
        await firebasefunctions.IncrementCommandCount(this.name, 1, firedb);

        const image_query = args.join(' ');
        if (!image_query) return messages.send_reply(firedb, message, 'Please enter an image name');

        const image_results = await google.scrape(image_query, 100);
        const num = Math.floor(Math.random() * image_results.length);
        if (image_results[num].url !== undefined)
            messages.send_reply(firedb, message, image_results[num].url);
    },
};

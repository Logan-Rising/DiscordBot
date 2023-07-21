const Discord = require('discord.js');
require('discord-reply');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const app = require('firebase/app');
const fire = require('firebase/firestore');
const constants = require('./constants.js');
const functions = require('./functions/customfunctions.js');

// client.on('ready', function() {
//     client.user.setUsername(constants.botName);
// })

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const firebaseConfig = constants.firebaseConfig;

// Initialize Firebase
const firebaseApp = app.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = fire.getFirestore(firebaseApp);

[
    'game_command_handler',
    'event_handler',
    'general_command_handler',
    'admin_command_handler',
    'image_command_handler',
    'owner_command_handler',
    'custom_command_handler',
].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord, db);
});

client.login(constants.DISCORD_TOKEN);

functions.onStartup(client);

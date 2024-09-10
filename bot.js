const { Discord, Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
    ],
});

const app = require('firebase/app');
const fire = require('firebase/firestore');
const constants = require('./src/assets/config.js');
const databasefunctions = require('./src/functions/databasefunctions.js');
const reactionmessagefunctions = require('./src/functions/reactionmessagefunctions.js');
const messages = require('./src/functions/messages.js');

client.commands = new Collection();
client.events = new Collection();

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
    require(`./src/handlers/${handler}`)(client, Discord, db);
});

client.login(constants.DISCORD_TOKEN);

client.on('ready', async () => {
    constants.onStartup(client, db);

    if (!constants.debug) {
        // await databasefunctions.SyncCachedServerSettings(db);    // Sync firebase server data to cache database
        await reactionmessagefunctions.SetupOldReactionMessages(db, client); // Restart reaction role messages listeners
        console.log(constants.imagesFilePath)
        await databasefunctions.RolloverDailyData(db, client, messages.server_log, constants.imagesFilePath); // Set up rolling data at midnight
        // await databasefunctions.CheckYesterday(db); // Roll over data if there was no data yesterday
    }

    // Set status then every 5 minutes set server count and update status
    databasefunctions.SetStatus(db);
    setInterval(async () => {
        // Set server count
        databasefunctions.SetServerCount(db, client);
        // Set bot status
        databasefunctions.SetStatus(db);
    }, 300000);
});

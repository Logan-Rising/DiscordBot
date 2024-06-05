const { Discord, Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
	],
});

const app = require('firebase/app');
const fire = require('firebase/firestore');
const constants = require('./constants/constants.js');
const databasefunctions = require('./functions/databasefunctions.js');
const reactionmessagefunctions = require('./functions/reactionmessagefunctions.js');

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
    require(`./handlers/${handler}`)(client, Discord, db);
});

client.login(constants.DISCORD_TOKEN);

client.on('ready', async () => {
    constants.onStartup(client, db);

    if (!constants.debug) {
        // await databasefunctions.SyncCachedServerSettings(db);
        await reactionmessagefunctions.SetupOldReactionMessages(db, client);
        await databasefunctions.RolloverDailyData(db);
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

const databasefunctions = require('../src/functions/databasefunctions.js');
const constants = require('../src/constants/constants.js');

const firebaseConfig = constants.firebaseConfig;

// Initialize Firebase
const firebaseApp = app.initializeApp(firebaseConfig);
const firedb = fire.getFirestore(firebaseApp);

const admin_commands = ['ban', 'kick', 'addfilteredword', 'removefilteredword', 'resetfilteredwordslist', 'setdefaultfilteredwords', 'seedefaultfilteredwordlist', 'setfiltersettings', 'viewdefaultfilteredwordslist'];
const general_commands = ['8ball', 'dependencies', 'help', 'pfp', 'ping', 'specs', 'suggestion'];
const game_commands = ['hangman', 'ttt'];
const owner_commands = ['deleteguildcommand', 'getcommandusage', 'getimageusage', 'initializenewcommand', 'initializenewimagecommand', 'registerguildcommand', 'syncserverdatabase', 'terminate', 'turnoffcomputer'];
const image_commands = ['addimage', 'deleteimage', 'image', 'jotchua', 'meme'];
const console_logs = ['error', 'info', 'log', 'warn'];
const messaging = ['interactions_recieved', 'messages_deleted', 'messages_read', 'messages_sent', 'reactions_collected'];

// Admin Commands
for ( let i = 0; i < admin_commands.length; i++ ) {
    (await databasefunctions.InitializeCommand(admin_commands[i], 'admin', firedb))
    ? console.log(admin_commands[i] + ' initialized successfully')
    : console.log(admin_commands[i] + ' initialization failed');
}

// General Commands
for ( let i = 0; i < general_commands.length; i++ ) {
    (await databasefunctions.InitializeCommand(general_commands[i], 'general', firedb))
    ? console.log(general_commands[i] + ' initialized successfully')
    : console.log(general_commands[i] + ' initialization failed');
}

// Game Commands
for ( let i = 0; i < game_commands.length; i++ ) {
    (await databasefunctions.InitializeCommand(game_commands[i], 'game', firedb))
    ? console.log(game_commands[i] + ' initialized successfully')
    : console.log(game_commands[i] + ' initialization failed');
}

// Owner Commands
for ( let i = 0; i < owner_commands.length; i++ ) {
    (await databasefunctions.InitializeCommand(owner_commands[i], 'owner', firedb))
    ? console.log(owner_commands[i] + ' initialized successfully')
    : console.log(owner_commands[i] + ' initialization failed');
}

// Image Commnads
for ( let i = 0; i < image_commands.length; i++ ) {
    (await databasefunctions.InitializeCommand(image_commands[i], 'image', firedb))
    ? console.log(image_commands[i] + ' initialized successfully')
    : console.log(image_commands[i] + ' initialization failed');
}

// Messaging
for ( let i = 0; i < messaging.length; i++ ) {
    (await databasefunctions.SetCloudData(firedb, 'messaging', messaging[i], {index: 0, daily: 0}))
    ? console.log(messaging[i] + ' initialized successfully')
    : console.log(messaging[i] + ' initialization failed');
}

// Console
for ( let i = 0; i < console_logs.length; i++ ) {
    (await databasefunctions.SetCloudData(firedb, 'console', console_logs[i], {index: 0}))
    ? console.log(console_logs[i] + ' initialized successfully')
    : console.log(console_logs[i] + ' initialization failed');
}

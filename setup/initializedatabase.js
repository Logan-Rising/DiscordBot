const databasefunctions = require('../src/functions/databasefunctions.js');
const logging = require('../src/functions/logging.js');
const constants = require('../src/assets/config.js');
const fire = require('firebase/firestore');
const app = require('firebase/app');
const fs = require('fs');
const path = require('path');

const firebaseConfig = constants.firebaseConfig;

// Initialize Firebase
const firebaseApp = app.initializeApp(firebaseConfig);
const firedb = fire.getFirestore(firebaseApp);

if (!firedb) {
    console.log('Firestore database did not return an instance. Make sure your firebase config is correct.');
    return;
}

const admin_commands = GetFileNames('../src/admin_commands');
const general_commands = GetFileNames('../src/general_commands');
const game_commands = GetFileNames('../src/game_commands');
const owner_commands = GetFileNames('../src/owner_commands');
const image_commands = GetFileNames('../src/image_commands');
const messaging = [
    'interactions_recieved',
    'messages_deleted',
    'messages_read',
    'messages_sent',
    'reactions_collected',
];

// Admin Commands
for (let i = 0; i < admin_commands.length; i++) {
    (await databasefunctions.InitializeCommand(admin_commands[i], 'admin', firedb))
        ? logging.log(firedb, admin_commands[i] + ' initialized successfully')
        : logging.log(firedb, admin_commands[i] + ' initialization failed');
}

// General Commands
for (let i = 0; i < general_commands.length; i++) {
    (await databasefunctions.InitializeCommand(general_commands[i], 'general', firedb))
        ? logging.log(firedb, general_commands[i] + ' initialized successfully')
        : logging.log(firedb, general_commands[i] + ' initialization failed');
}

// Game Commands
for (let i = 0; i < game_commands.length; i++) {
    (await databasefunctions.InitializeCommand(game_commands[i], 'game', firedb))
        ? logging.log(firedb, game_commands[i] + ' initialized successfully')
        : logging.log(firedb, game_commands[i] + ' initialization failed');
}

// Owner Commands
for (let i = 0; i < owner_commands.length; i++) {
    (await databasefunctions.InitializeCommand(owner_commands[i], 'owner', firedb))
        ? logging.log(firedb, owner_commands[i] + ' initialized successfully')
        : logging.log(firedb, owner_commands[i] + ' initialization failed');
}

// Image Commnads
for (let i = 0; i < image_commands.length; i++) {
    (await databasefunctions.InitializeCommand(image_commands[i], 'image', firedb))
        ? logging.log(firedb, image_commands[i] + ' initialized successfully')
        : logging.log(firedb, image_commands[i] + ' initialization failed');
}

// Messaging
for (let i = 0; i < messaging.length; i++) {
    (await databasefunctions.SetCloudData(firedb, 'messaging', messaging[i], { index: 0, daily: 0 }))
        ? logging.log(firedb, messaging[i] + ' initialized successfully')
        : logging.log(firedb, messaging[i] + ' initialization failed');
}

function GetFileNames(folderPath) {
    try {
        // Read all files in the folder
        const files = fs.readdirSync(folderPath);
        
        // Filter and map the files to include only .js files
        const jsFiles = files
            .filter(file => path.extname(file) === '.js')
            .map(file => path.basename(file, '.js'));

        return jsFiles;
    } catch (error) {
        console.error(`Error reading directory: ${error.message}`);
    }
}

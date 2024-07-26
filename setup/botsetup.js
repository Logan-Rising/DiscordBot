/*
 * Run this script from Command Prompt (Windows) or Terminal (macOS) in this directory using 'node botsetup.js'
 */

const fs = require('fs');

/* Initialize constants file. Fill in variable values once initialized. */
const constantsPath = '../constants/constants.js';
const constantsContent = `// Whether or not to run certain things based on if bot is in debug or not
const debug = false;

// Ids of users who will have access to addimage and deleteimage commands
// Leave blank for all users to be able to use
const Image_Permissions = [];

// Ids of servers in which addimage and deleteimage can be used in
// Leave blank for all servers to be able to use
const Image_Servers = [];

// Specs of the machine running the discord bot. String of the specs and a photo of the pc
const specs = {
    specsString: '',
    specsPhoto: '',
};

// Firebase configuration from the project settings on Google Firebase
const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  };

// Name of the discord bot
const botName = '';

// This bot's discord id
const botId = '';

// Bot's application id from developer portal
const CLIENT_ID = '';

// Discord bot token from the developer portal
const DISCORD_TOKEN = 0;

// Path to the images storage on the local machine
const imagesFilePath = '';

// Owner's discord id
const ownerId = '';

// Path to the gif that is edited upon users kick or ban
const kickGifPath = '';

// Message that is logged to the console when the bot is started
const startupMessage = botName + ' Is Online!';

// Path to suggestions.txt file. Can change to desired directory.
const suggestionsPath = '../suggestions.txt';

// Whether to include age restricted channels as private channels or not
const includeAgeRestrictionAsPrivate = false;

// Default list of filtered words in messages
const defaultBannedWordList = [];

// Function that is executed when user is kicked or banned
async function onKickBan(name, channel) {
    return;
}

// Function that runs when the bot starts up in src/bot.js
async function onStartup() {
    return;
}

module.exports = {
    Image_Permissions,
    Record_Permissions,
    Image_Servers,
    specs,
    firebaseConfig,
    botName,
    botId,
    CLIENT_ID,
    DISCORD_TOKEN,
    imagesFilePath,
    ownerId,
    kickGifPath,
    startupMessage,
    suggestionsPath,
    includeAgeRestrictionAsPrivate,
};
`;

/* Initialize constants.js file. Fill out custom functions if desired to edit gifs upon user being kicked.*/
fs.appendFile(constantsPath, constantsContent, err => {
    if (err) {
        console.error(err);
    }
});

/* Initialize custom commands directory */
const customCommands = '../custom_commands';

fs.access(customCommands, error => {
    if (error) {
        fs.mkdir(customCommands, error => {
            if (error) {
                console.log(error);
            }
            // Directory created successfully
        });
    }
});

// Create server message filter cache
var createStream = fs.createWriteStream('./events/guild/server_message_filter_cache.json');
createStream.end();

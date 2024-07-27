const databasefunctions = require('../functions/databasefunctions.js');
const constants = require('../constants/constants.js');

const firebaseConfig = constants.firebaseConfig;

// Initialize Firebase
const firebaseApp = app.initializeApp(firebaseConfig);
const firedb = fire.getFirestore(firebaseApp);

// Initialize Image Commands
(await databasefunctions.InitializeImage('jotchua', firedb))
    ? console.log('jotchua initialized successfully')
    : console.log('jotchua initialization failed');

// Admin Commands
(await databasefunctions.InitializeCommand('ban', 'admin', firedb))
    ? console.log('ban initialized successfully')
    : console.log('ban initialization failed');
(await databasefunctions.InitializeCommand('kick', 'admin', firedb))
    ? console.log('kick initialized successfully')
    : console.log('kick initialization failed');

// Game Commands
(await databasefunctions.InitializeCommand('hangman', 'game', firedb))
    ? console.log('hangman initialized successfully')
    : console.log('hangman initialization failed');
(await databasefunctions.InitializeCommand('ttt', 'game', firedb))
    ? console.log('ttt initialized successfully')
    : console.log('ttt initialization failed');

// General Commands
(await databasefunctions.InitializeCommand('8ball', 'general', firedb))
    ? console.log('8ball initialized successfully')
    : console.log('8ball initialization failed');
(await databasefunctions.InitializeCommand('suggestion', 'general', firedb))
    ? console.log('changerequest initialized successfully')
    : console.log('changerequest initialization failed');
(await databasefunctions.InitializeCommand('dependencies', 'general', firedb))
    ? console.log('dependencies initialized successfully')
    : console.log('dependencies initialization failed');
(await databasefunctions.InitializeCommand('help', 'general', firedb))
    ? console.log('help initialized successfully')
    : console.log('help initialization failed');
(await databasefunctions.InitializeCommand('pfp', 'general', firedb))
    ? console.log('pfp initialized successfully')
    : console.log('pfp initialization failed');
(await databasefunctions.InitializeCommand('ping', 'general', firedb))
    ? console.log('ping initialized successfully')
    : console.log('ping initialization failed');
(await databasefunctions.InitializeCommand('specs', 'general', firedb))
    ? console.log('specs initialized successfully')
    : console.log('specs initialization failed');

// Image Commands
(await databasefunctions.InitializeCommand('addimage', 'image', firedb))
    ? console.log('addimage initialized successfully')
    : console.log('addimage initialization failed');
(await databasefunctions.InitializeCommand('deleteimage', 'image', firedb))
    ? console.log('deleteimage initialized successfully')
    : console.log('deleteimage initialization failed');
(await databasefunctions.InitializeCommand('image', 'image', firedb))
    ? console.log('imagev initialized successfully')
    : console.log('image initialization failed');

// Owner Commands
(await databasefunctions.InitializeCommand('initializenewcommand', 'owner', firedb))
    ? console.log('initializenewcommand initialized successfully')
    : console.log('initializenewcommand initialization failed');
(await databasefunctions.InitializeCommand('terminate', 'owner', firedb))
    ? console.log('terminate initialized successfully')
    : console.log('terminate initialization failed');
(await databasefunctions.InitializeCommand('turnoffcomputer', 'owner', firedb))
    ? console.log('turnoffcomputer initialized successfully')
    : console.log('turnoffcomputer initialization failed');
(await databasefunctions.InitializeCommand('getcommandusage', 'owner', firedb))
    ? console.log('getcommandusage initialized successfully')
    : console.log('getcommandusage initialization failed');
(await databasefunctions.InitializeCommand('getimageusage', 'owner', firedb))
    ? console.log('getcommandusage initialized successfully')
    : console.log('getcommandusage initialization failed');

// Messaging
(await databasefunctions.SetIndex(firedb, 0, 'messaging', 'messages_read'))
    ? console.log('messages_read initialized successfully')
    : console.log('messages_read initialization failed');
(await databasefunctions.SetIndex(firedb, 0, 'messaging', 'messages_sent'))
    ? console.log('messages_sent initialized successfully')
    : console.log('messages_sent initialization failed');
(await databasefunctions.SetInteractionCount(firedb, 0))
    ? console.log('interactions_received initialized successfully')
    : console.log('interactions_received initialization failed');

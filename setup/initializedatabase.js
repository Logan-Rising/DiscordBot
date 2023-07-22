const firebasefunctions = require('../functions/firebasefunctions.js');
const constants = require('../constants.js');

const firebaseConfig = constants.firebaseConfig;

// Initialize Firebase
const firebaseApp = app.initializeApp(firebaseConfig);
const firedb = fire.getFirestore(firebaseApp);

// Initialize Image Commands
(await firebasefunctions.InitializeImage('jotchua', firedb))
    ? console.log('jotchua initialized successfully')
    : console.log('jotchua initialization failed');

// Admin Commands
(await firebasefunctions.InitializeCommand('ban', 'admin', firedb))
    ? console.log('ban initialized successfully')
    : console.log('ban initialization failed');
(await firebasefunctions.InitializeCommand('kick', 'admin', firedb))
    ? console.log('kick initialized successfully')
    : console.log('kick initialization failed');

// Game Commands
(await firebasefunctions.InitializeCommand('hangman', 'game', firedb))
    ? console.log('hangman initialized successfully')
    : console.log('hangman initialization failed');
(await firebasefunctions.InitializeCommand('ttt', 'game', firedb))
    ? console.log('ttt initialized successfully')
    : console.log('ttt initialization failed');

// General Commands
(await firebasefunctions.InitializeCommand('8ball', 'general', firedb))
    ? console.log('8ball initialized successfully')
    : console.log('8ball initialization failed');
(await firebasefunctions.InitializeCommand('suggestion', 'general', firedb))
    ? console.log('changerequest initialized successfully')
    : console.log('changerequest initialization failed');
(await firebasefunctions.InitializeCommand('dependencies', 'general', firedb))
    ? console.log('dependencies initialized successfully')
    : console.log('dependencies initialization failed');
(await firebasefunctions.InitializeCommand('help', 'general', firedb))
    ? console.log('help initialized successfully')
    : console.log('help initialization failed');
(await firebasefunctions.InitializeCommand('pfp', 'general', firedb))
    ? console.log('pfp initialized successfully')
    : console.log('pfp initialization failed');
(await firebasefunctions.InitializeCommand('ping', 'general', firedb))
    ? console.log('ping initialized successfully')
    : console.log('ping initialization failed');
(await firebasefunctions.InitializeCommand('specs', 'general', firedb))
    ? console.log('specs initialized successfully')
    : console.log('specs initialization failed');

// Image Commands
(await firebasefunctions.InitializeCommand('addimage', 'image', firedb))
    ? console.log('addimage initialized successfully')
    : console.log('addimage initialization failed');
(await firebasefunctions.InitializeCommand('deleteimage', 'image', firedb))
    ? console.log('deleteimage initialized successfully')
    : console.log('deleteimage initialization failed');
(await firebasefunctions.InitializeCommand('image', 'image', firedb))
    ? console.log('imagev initialized successfully')
    : console.log('image initialization failed');

// Owner Commands
(await firebasefunctions.InitializeCommand('initializenewcommand', 'owner', firedb))
    ? console.log('initializenewcommand initialized successfully')
    : console.log('initializenewcommand initialization failed');
(await firebasefunctions.InitializeCommand('terminate', 'owner', firedb))
    ? console.log('terminate initialized successfully')
    : console.log('terminate initialization failed');
(await firebasefunctions.InitializeCommand('turnoffcomputer', 'owner', firedb))
    ? console.log('turnoffcomputer initialized successfully')
    : console.log('turnoffcomputer initialization failed');
(await firebasefunctions.InitializeCommand('getcommandusage', 'owner', firedb))
    ? console.log('getcommandusage initialized successfully')
    : console.log('getcommandusage initialization failed');
(await firebasefunctions.InitializeCommand('getimageusage', 'owner', firedb))
    ? console.log('getcommandusage initialized successfully')
    : console.log('getcommandusage initialization failed');

// Messaging
(await firebasefunctions.SetMessagesRead(firedb, 0))
    ? console.log('messages_read initialized successfully')
    : console.log('messages_read initialization failed');
(await firebasefunctions.SetMessagesSent(firedb, 0))
    ? console.log('messages_sent initialized successfully')
    : console.log('messages_sent initialization failed');

const databasefunctions = require('../functions/databasefunctions.js');
const discordfunctions = require('../functions/discordfunctions.js');
const logging = require('../functions/logging.js');
const messages = require('../functions/messages.js');
const {translate} = require('free-translate');
const languages = require('../assets/supportedlanguages.js');

module.exports = {
    name: 'translate',
    description: 'Reply to a message with this command to translate the message',
    users: [],
    servers: [],
    syntax: '&translate\nCommon languages: English: en\nSpanish: es\nChinese: zh-CN\nFrench: fr\nItalian: it\nJapanese: ja\nArabic: ar\n' + 
    'See this link to language codes for another language not listed here: ' + languages.languagesLink,
    async execute(client, message, args, Discord, firedb) {
        await databasefunctions.IncrementDaily(firedb, 1, 'commands', this.name);

        if ( !args[0] ) {
            messages.send_reply(firedb, message, "Must specify language to translate to" );
            return;
        }

        let language = args[0].toLowerCase();

        const abbr = languages.abbrLanguages.includes(language);
        const name = languages.languages.includes(language);

        // User gave invalid language
        if ( !name && !abbr) {
            messages.send_reply(firedb, message, 'Language not recognized. Use &help translate for help with this command');
            return;
        }

        // User gave valid language so handle it
        if ( name ) {
            const index = languages.languages.findIndex(element=>element.includes(language));
            language = languages.abbrLanguages[index];
        }

        try {
            let repliedMessage = await discordfunctions.GetMessage(client, message.reference.messageId, message.reference.channelId);

            const translatedText = await translate(repliedMessage.content, { to: language });

            messages.delete_message(firedb, message);

            messages.send_reply(firedb, repliedMessage, translatedText, false);
        } catch (error) {
            logging.error(error);
        }

        return;
    },
};

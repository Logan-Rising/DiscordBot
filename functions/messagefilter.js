const databasefunctions = require('./databasefunctions.js');
const messagefunctions = require('./messages.js');
const constants = require('../constants.js');

async function FilterMessage(firedb, message) { // Server exists in filter database
    if (await databasefunctions.GetServerFilterInfo(message.guild.id)) {
        if (await databasefunctions.GetServerFilterSetting(message.guild.id)) {
            const serverFilteredWordList = await databasefunctions.GetServerFilterList(message.guild.id);

            const messageString = message.content;

            for (i = 0; i < serverFilteredWordList.length; i++) {
                if (messageString.includes(serverFilteredWordList[i])) {
                    const wordFiltered = serverFilteredWordList[i];
                    messagefunctions.send_message(firedb, message.author, 'The word \'' + wordFiltered + '\' is not allowed in ' + message.guild.name + 
                    '. Please refrain from using it in the future. Thank you!');
                    messagefunctions.delete_message(firedb, message);
                }
            }
        }
    } else {    // Server does not exist in filter database
        databasefunctions.InitializeNewServerFilter(firedb, message.guild.id);
    }
}

module.exports = { FilterMessage };
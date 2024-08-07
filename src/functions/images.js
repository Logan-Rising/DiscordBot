const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');
const constants = require('../assets/config.js');
const logging = require('../functions/logging.js');

async function GetImage(message, name, firedb) {
    let num = await databasefunctions.GetIndex(firedb, 'images', name);

    if (num === -1) {
        logging.log(firedb, name + ' does not exist in database');
        return;
    } else if (num === 0) {
        logging.log(firedb, name + ' does not have an images. Use &addimage to add images for this category.');
        return;
    }

    var imagemNum = Math.floor(Math.random() * num);
    const file = { files: [constants.imagesFilePath + name + '/' + name + '_' + imagemNum + '.jpg'] };
    if (file) messages.send_message(firedb, message.channel, file);
    else messages.send_reply(firedb, message, 'Internal error occurred. Please try again.');
}

module.exports = {
    GetImage,
};

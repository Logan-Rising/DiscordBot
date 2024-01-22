const databasefunctions = require('../functions/databasefunctions.js');
const messages = require('../functions/messages.js');
const constants = require('../constants');

async function GetImage(message, name, firedb) {
    let num = await databasefunctions.GetImageIndex(name, firedb);

    if (num === -1) {
        console.log(name + ' does not exist in database');
        return;
    } else if (num === 0) {
        console.log(name + ' does not have an images. Use &addimage to add images for this category.');
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

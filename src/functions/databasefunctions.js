const fire = require('firebase/firestore');
const utilities = require('./utilities.js');
const discordfunctions = require('./discordfunctions.js');
const logging = require('./logging.js');

// Local cache json database
const JSONdb = require('simple-json-db');
const { util } = require('prettier');
const { image } = require('image-downloader');
const db = new JSONdb('./cache/server_message_filter_cache.json');

async function SetCloudData(firedb, document, collection, data) {
    let success = true;
    try {
        const docRef = await fire.doc(firedb, document, collection);
        await fire.setDoc(docRef, data);
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

// https://firebase.google.com/docs/firestore/manage-data/delete-data
async function DeleteFirebaseDocument(firedb, collection, document) {
    return await fire.deleteDoc(fire.doc(firedb, collection, document));
}

async function IncrementDaily(firedb, number, collection, document) {
    try {
        const docRef = await fire.doc(firedb, collection, document);
        const docSnap = await fire.getDoc(docRef);

        if (!docSnap.exists()) {
            return logging.log(firedb, 'Could not find data with specified collection and document.');
        }

        let data = docSnap.data();
        data.daily = data.daily + number;

        await fire.setDoc(docRef, data);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function IncrementIndex(firedb, number, collection, document) {
    try {
        const docRef = await fire.doc(firedb, collection, document);
        const docSnap = await fire.getDoc(docRef);

        if (!docSnap.exists()) {
            return logging.log(firedb, 'Could not find data with specified collection and document.');
        }

        let data = docSnap.data();
        data.index = data.index + number;

        await fire.setDoc(docRef, data);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetIndex(firedb, number, collection, document) {
    try {
        const docRef = await fire.doc(firedb, collection, document);
        const docSnap = await fire.getDoc(docRef);

        if (!docSnap.exists()) {
            return logging.log(firedb, 'Could not find data with specified collection and document.');
        }

        let data = docSnap.data();
        data.index = number;

        await fire.setDoc(docRef, data);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function GetIndex(firedb, collection, document) {
    try {
        const docRef = await fire.doc(firedb, collection, document);
        const docSnap = await fire.getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().index;
        }
    } catch (error) {
        logging.error(firedb, error);
    }

    return -1;
}

async function CheckIfImageNameExists(firedb, name) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);
        if (docSnap.exists()) {
            return true;
        }
    } catch (error) {
        logging.error(firedb, error);
    }

    return false;
}

async function GetImageUsage(name, firedb) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().command_usage;
        }
    } catch (error) {
        logging.error(firedb, error);
    }

    return -1;
}

async function IncrementImageUsage(name, firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        let data = docSnap.data();
        data.daily = data.daily + number;

        await fire.setDoc(docRef, data);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetImageUsage(name, firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        let data = docSnap.data();
        data.index = number;

        await fire.setDoc(docRef, { command_usage: number, data });
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function InitializeImage(name, firedb, type) {
    let success = true;
    try {
        const docRef = await fire.doc(firedb, 'images', name);

        await fire.setDoc(docRef, { command_usage: 0, daily: 0, index: 0, type: type });
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function InitializeCommand(commandName, type, firedb) {
    let success = true;

    try {
        const docRef = await fire.doc(firedb, 'commands', commandName);
        await fire.setDoc(docRef, { index: 0, type: type, daily: 0 });
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function SyncCachedServerSettings(firedb) {
    try {
        const servers = fire.query(fire.collection(firedb, 'servers'));

        const querySnapshot = await fire.getDocs(servers);
        querySnapshot.forEach(doc => {
            const serverId = doc.id;
            const serverFilterInfo = doc.data();

            db.set(serverId, serverFilterInfo);
        });
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function GetServerInfo(serverId) {
    const cacheServerInfo = await db.get(serverId);
    return cacheServerInfo;
}

async function GetServerFilterSetting(serverId) {
    const cacheServerFilterInfo = await db.get(serverId);
    return cacheServerFilterInfo.filter_status;
}

async function SetServerFilterSetting(firedb, serverId, setting) {
    let success = true;

    try {
        let serverInfo = await GetServerInfo(serverId);

        serverInfo.filter_status = setting;

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);

        db.set(serverId, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function GetServerFilterList(serverId) {
    const cacheServerFilterInfo = await db.get(serverId);
    return cacheServerFilterInfo.filtered_words;
}

async function SetServerFilterList(firedb, serverId, list) {
    let success = true;

    try {
        let serverInfo = await GetServerInfo(serverId);

        serverInfo.filtered_words = list;

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);

        db.set(serverId, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function RemoveServerFilteredWord(firedb, serverId, word) {
    let cacheServerFilteredWords = await GetServerFilterList(serverId);

    if (cacheServerFilteredWords.includes(word)) {
        cacheServerFilteredWords = cacheServerFilteredWords.filter(e => e !== word);
        let serverInfo = await GetServerInfo(serverId);

        serverInfo.filtered_words = cacheServerFilteredWords;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } else {
        return;
    }
}

async function AddServerFilteredWord(firedb, serverId, word) {
    let cacheServerFilteredWords = await GetServerFilterList(serverId);

    if (cacheServerFilteredWords.includes(word)) return;
    else {
        cacheServerFilteredWords.push(word);
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.filtered_words = cacheServerFilteredWords;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    }
}

async function GetServerFilterInfo(serverId) {
    return db.get(serverId);
}

async function InitializeNewServer(firedb, serverId) {
    let success = true;

    try {
        const serverFilterInfo = {
            filter_status: false,
            filtered_words: [],
        };

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverFilterInfo);

        db.set(serverId, serverFilterInfo);
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function SetInteractionCount(firedb, number) {
    let success = true;

    try {
        const docRef = await fire.doc(firedb, 'messaging', 'interactions_received');
        await fire.setDoc(docRef, { index: number });
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function GetServerReactionRoleCount(serverId) {
    const serverInfo = db.get(serverId);
    return serverInfo.reaction_role_messages;
}

async function IncrementReactionRoleMessageCount(firedb, serverId) {
    let newCount = (await GetServerReactionRoleCount(serverId)) + 1;

    SetReactionRoleMessageCount(firedb, serverId, newCount);
}

async function DecrementReactionRoleMessageCount(firedb, serverId) {
    let newCount = (await GetServerReactionRoleCount(serverId)) - 1;

    await SetReactionRoleMessageCount(firedb, serverId, newCount);
}

async function SetReactionRoleMessageCount(firedb, serverId, count) {
    let success = true;

    try {
        let serverInfo = await GetServerInfo(serverId);

        serverInfo.reaction_role_messages = count;

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);

        db.set(serverId, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function RolloverDailyData(firedb) {
    const todayDate = utilities.GetDateNoTime(); // Current date
    var now = new Date();
    var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0) - now;
    if (millisTill10 < 0) {
        millisTill10 += 86400000;
    }
    setTimeout(async function () {
        await ResetDailyCommands(firedb, todayDate); // Reset daily statistics
        RolloverDailyData(firedb); // Rollover again tomorrow
    }, millisTill10);
}

async function ResetDailyCommands(firedb, todayDate) {
    try {
        let commandInfo = {};
        let imageInfo = {
            custom: 0,
            all: 0,
        };
        let messagingInfo = {};

        // Roll over commands
        const commands = fire.query(fire.collection(firedb, 'commands'));
        const querySnapshotCommands = await fire.getDocs(commands);
        querySnapshotCommands.forEach(async doc => {
            const data = doc.data();

            const currentCommandInfo = {
                type: data.type,
                index: data.daily,
            };

            commandInfo[doc.id] = currentCommandInfo;

            data.index = data.index + data.daily;
            data.daily = 0;

            await fire.setDoc(fire.doc(firedb, 'commands', doc.id), data);
        });

        // Roll over messaging related information
        const messaging = fire.query(fire.collection(firedb, 'messaging'));
        const querySnapshotMessaging = await fire.getDocs(messaging);
        querySnapshotMessaging.forEach(async doc => {
            const data = doc.data();

            const currentMessagingInfo = {
                index: data.daily,
            };

            messagingInfo[doc.id] = currentMessagingInfo;

            data.index = data.index + data.daily;
            data.daily = 0;

            await fire.setDoc(fire.doc(firedb, 'messaging', doc.id), data);
        });

        // Roll over image commands
        const images = fire.query(fire.collection(firedb, 'images'));
        const querySnapshotImages = await fire.getDocs(images);
        querySnapshotImages.forEach(async doc => {
            const data = doc.data();

            if (imageInfo.type === 'all') {
                imageInfo.all = imageInfo.all + data.daily;
            } else {
                imageInfo.custom = imageInfo.custom + data.daily;
            }

            data.command_usage = data.command_usage + data.daily;
            data.daily = 0;

            await fire.setDoc(fire.doc(firedb, 'images', doc.id), data);
        });

        const dateInfo = {
            commands: commandInfo,
            messaging: messagingInfo,
            images: imageInfo,
        };

        await SetCloudData(firedb, 'daily_stats', todayDate, dateInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetStatus(firedb) {
    try {
        const docRef = await fire.doc(firedb, 'status', 'bot_status');
        const docSnap = await fire.getDoc(docRef);

        let data = docSnap.data();
        data.timestamp = fire.Timestamp.now();

        await fire.setDoc(docRef, data);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetServerCount(firedb, client) {
    try {
        const docRef = await fire.doc(firedb, 'servers', 'serving');
        const docSnap = await fire.getDoc(docRef);

        let data = docSnap.data();
        const serverCount = await discordfunctions.GetServerCount(client);

        if (data.server_count != serverCount) {
            data.server_count = serverCount;
            await fire.setDoc(docRef, data);
        }
    } catch (error) {
        logging.error(firedb, error);
    }
}

module.exports = {
    SetCloudData,
    DeleteFirebaseDocument,
    IncrementDaily,
    IncrementIndex,
    SetIndex,
    GetIndex,
    CheckIfImageNameExists,
    GetImageUsage,
    IncrementImageUsage,
    SetImageUsage,
    InitializeImage,
    InitializeCommand,
    SyncCachedServerSettings,
    SetServerFilterSetting,
    AddServerFilteredWord,
    RemoveServerFilteredWord,
    GetServerFilterList,
    GetServerFilterSetting,
    SetServerFilterList,
    GetServerFilterInfo,
    InitializeNewServer,
    SetInteractionCount,
    IncrementReactionRoleMessageCount,
    DecrementReactionRoleMessageCount,
    RolloverDailyData,
    ResetDailyCommands,
    SetStatus,
    SetServerCount,
};

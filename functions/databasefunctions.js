const fire = require('firebase/firestore');

// Local cache json database
const JSONdb = require('simple-json-db');
const db = new JSONdb('./cache/server_message_filter_cache.json');

async function SetCloudData(firedb, document, collection, data) {
    const docRef = await fire.doc(firedb, document, collection);
    await fire.setDoc(docRef, data);
}

// https://firebase.google.com/docs/firestore/manage-data/delete-data
async function DeleteFirebaseDocument(firedb, collection, document) {
    return await fire.deleteDoc(fire.doc(firedb, collection, document));
}

async function CheckIfImageNameExists(firedb, name) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);
        if (docSnap.exists()) {
            return true;
        }
    } catch (error) {
        console.log(error);
    }

    return false;
}

async function GetImageIndex(name, firedb) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().index;
        }
    } catch (error) {
        console.log(error);
    }

    return -1;
}

async function GetImageUsage(name, firedb) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().command_usage;
        }
    } catch (error) {
        console.log(error);
    }

    return -1;
}

async function IncrementImageUsage(name, firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        const currentIndex = docSnap.data().index;
        const currentCommandUsage = docSnap.data().command_usage;

        await fire.setDoc(docRef, { command_usage: currentCommandUsage + number, index: currentIndex });
    } catch (error) {
        console.log(error);
    }
}

async function SetImageUsage(name, firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        const currentCommandIndex = docSnap.data().index;

        await fire.setDoc(docRef, { command_usage: number, index: currentCommandIndex });
    } catch (error) {
        console.log(error);
    }
}

async function IncrementImageIndex(name, number, firedb) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        const currentCommandUsage = docSnap.data().command_usage;
        const currentCommandIndex = docSnap.data().index;

        await fire.setDoc(docRef, { command_usage: currentCommandUsage, index: currentCommandIndex + number });
    } catch (error) {
        console.log(error);
    }
}

async function SetImageIndex(name, number, firedb) {
    try {
        const docRef = await fire.doc(firedb, 'images', name);
        const docSnap = await fire.getDoc(docRef);

        const currentCommandUsage = docSnap.data().command_usage;

        await fire.setDoc(docRef, { command_usage: currentCommandUsage, index: number });
    } catch (error) {
        console.log(error);
    }
}

async function InitializeImage(name, firedb) {
    let success = true;
    try {
        const docRef = await fire.doc(firedb, 'images', name);

        await fire.setDoc(docRef, { command_usage: 0, index: 0 });
    } catch (error) {
        console.log(error);
        success = false;
    }
    return success;
}

async function GetCommandCount(commandName, firedb) {
    try {
        const docRef = await fire.doc(firedb, 'commands', commandName);
        const docSnap = await fire.getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().index;
        }
    } catch (error) {
        console.log(error);
    }

    return -1;
}

async function IncrementCommandCount(commandName, number, firedb) {
    try {
        const docRef = await fire.doc(firedb, 'commands', commandName);
        const docSnap = await fire.getDoc(docRef);

        const currentCount = docSnap.data().index;
        const currentType = docSnap.data().type;

        await fire.setDoc(docRef, { index: currentCount + number, type: currentType });
    } catch (error) {
        console.log(error);
    }
}

async function SetCommandCount(commandName, number, firedb) {
    try {
        const docRef = await fire.doc(firedb, 'commands', commandName);
        const docSnap = await fire.getDoc(docRef);

        const currentType = docSnap.data().type;

        await fire.setDoc(docRef, { index: number, type: currentType });
    } catch (error) {
        console.log(error);
    }
}

async function InitializeCommand(commandName, type, firedb) {
    let success = true;

    try {
        const docRef = await fire.doc(firedb, 'commands', commandName);
        await fire.setDoc(docRef, { index: 0, type: type });
    } catch (error) {
        console.log(error);
        success = false;
    }
    return success;
}

async function SetMessagesRead(firedb, number) {
    let success = true;

    try {
        const docRef = await fire.doc(firedb, 'messaging', 'messages_read');
        await fire.setDoc(docRef, { index: number });
    } catch (error) {
        console.log(error);
        success = false;
    }
    return success;
}

async function GetMessagesRead(firedb) {
    try {
        const docRef = await fire.doc(firedb, 'messaging', 'messages_read');
        const docSnap = await fire.getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().index;
        }
    } catch (error) {
        console.log(error);
    }

    return -1;
}

async function SetMessagesSent(firedb, number) {
    let success = true;

    try {
        const docRef = await fire.doc(firedb, 'messaging', 'messages_sent');
        await fire.setDoc(docRef, { index: number });
    } catch (error) {
        console.log(error);
        success = false;
    }
    return success;
}

async function GetMessagesSent(firedb) {
    try {
        const docRef = await fire.doc(firedb, 'messaging', 'messages_sent');
        const docSnap = await fire.getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().index;
        }
    } catch (error) {
        console.log(error);
    }

    return -1;
}

async function IncrementMessageRead(firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'messaging', 'messages_read');
        const docSnap = await fire.getDoc(docRef);

        const currentCount = docSnap.data().index;

        await fire.setDoc(docRef, { index: currentCount + number });
    } catch (error) {
        console.log(error);
    }
}

async function IncrementMessageSent(firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'messaging', 'messages_sent');
        const docSnap = await fire.getDoc(docRef);

        const currentCount = docSnap.data().index;

        await fire.setDoc(docRef, { index: currentCount + number });
    } catch (error) {
        console.log(error);
    }
}

async function IncrementMessagesDeleted(firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'messaging', 'messages_deleted');
        const docSnap = await fire.getDoc(docRef);

        const currentCount = docSnap.data().index;

        await fire.setDoc(docRef, { index: currentCount + number });
    } catch (error) {
        console.log(error);
    }
}

async function SyncCachedServerSettings(firedb) {
    try {
        const servers = fire.query(fire.collection(firedb, 'servers'));

        const querySnapshot = await fire.getDocs(servers);
        querySnapshot.forEach((doc) => {
          const serverId = doc.id;
          const serverFilterInfo = doc.data();

          db.set(serverId, serverFilterInfo);
        });
    } catch (error) {
        console.log(error);
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
        console.log(error);
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
        console.log(error);
        success = false;
    }
    return success;
}

async function RemoveServerFilteredWord(firedb, serverId, word) {
    let cacheServerFilteredWords = await GetServerFilterList(serverId);

    if(cacheServerFilteredWords.includes(word)) {
        cacheServerFilteredWords = cacheServerFilteredWords.filter(e => e !== word);
        let serverInfo = await GetServerInfo(serverId);

        serverInfo.filtered_words = cacheServerFilteredWords;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    }
    else {
        return;
    }
}

async function AddServerFilteredWord(firedb, serverId, word) {
    let cacheServerFilteredWords = await GetServerFilterList(serverId);

    if(cacheServerFilteredWords.includes(word))
        return;
    else {
        cacheServerFilteredWords.push(word);
        const serverInfo = await GetServerFilterSetting(serverId);

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
        console.log(error);
        success = false;
    }
    return success;
}

async function IncrementInteractionCount(firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'messaging', 'interactions_received');
        const docSnap = await fire.getDoc(docRef);

        const currentCount = docSnap.data().index;

        await fire.setDoc(docRef, { index: currentCount + number });
    } catch (error) {
        console.log(error);
    }
}

async function SetInteractionCount(firedb, number) {
    let success = true;

    try {
        const docRef = await fire.doc(firedb, 'messaging', 'interactions_received');
        await fire.setDoc(docRef, { index: number });
    } catch (error) {
        console.log(error);
        success = false;
    }
    return success;
}

async function GetServerReactionRoleCount (serverId) {
    const serverInfo = db.get(serverId);
    return serverInfo.reaction_role_messages;
}

async function IncrementReactionRoleMessageCount(firedb, serverId) {
    let newCount = await GetServerReactionRoleCount(serverId) + 1;

    SetReactionRoleMessageCount(firedb, serverId, newCount);
}

async function DecrementReactionRoleMessageCount(firedb, serverId) {
    let newCount = await GetServerReactionRoleCount(serverId) - 1;

    SetReactionRoleMessageCount(firedb, serverId, newCount);
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
        console.log(error);
        success = false;
    }
    return success;
}

async function IncrementReactionCollectionCount(firedb, number) {
    try {
        const docRef = await fire.doc(firedb, 'messaging', 'reaction_collections');
        const docSnap = await fire.getDoc(docRef);

        const currentCount = docSnap.data().index;

        await fire.setDoc(docRef, { index: currentCount + number });
    } catch (error) {
        console.log(error);
    }
}

async function SetupReactionMessages() {
    try {
        const reactionMessages = fire.query(fire.collection(firedb, 'reaction_role_messages'));

        const querySnapshot = await fire.getDocs(reactionMessages);
        querySnapshot.forEach((doc) => {
          const messageId = doc.id;
          const messageInfo = doc.data();

          
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    SetCloudData,
    DeleteFirebaseDocument,
    CheckIfImageNameExists,
    GetImageIndex,
    GetImageUsage,
    IncrementImageUsage,
    SetImageUsage,
    InitializeImage,
    IncrementImageIndex,
    SetImageIndex,
    GetCommandCount,
    IncrementCommandCount,
    SetCommandCount,
    InitializeCommand,
    SetMessagesRead,
    GetMessagesRead,
    SetMessagesSent,
    GetMessagesSent,
    IncrementMessageRead,
    IncrementMessageSent,
    IncrementMessagesDeleted,
    SyncCachedServerSettings,
    SetServerFilterSetting,
    AddServerFilteredWord,
    RemoveServerFilteredWord,
    GetServerFilterList,
    GetServerFilterSetting,
    SetServerFilterList,
    GetServerFilterInfo,
    InitializeNewServer,
    IncrementInteractionCount,
    SetInteractionCount,
    IncrementReactionRoleMessageCount,
    DecrementReactionRoleMessageCount,
    IncrementReactionCollectionCount,
};

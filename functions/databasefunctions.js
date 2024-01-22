const fire = require('firebase/firestore');

// Local cache json database
const JSONdb = require('simple-json-db');
const db = new JSONdb('./events/guild/server_message_filter_cache.json');

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

async function SyncCachedServerFilterSettings(firedb) {
    try {
        const servers = fire.query(fire.collection(firedb, 'servers'));

        const querySnapshot = await fire.getDocs(servers);
        querySnapshot.forEach((doc) => {
          const serverId = doc.id;
          const serverFilterInfo = doc.data();
          const serverFilterStatus = serverFilterInfo.filter_status;
          const serverFilteredWords = serverFilterInfo.filtered_words;

          const serverInfoObject = {
            filter_status: serverFilterStatus,
            filtered_words: serverFilteredWords,
          };

          db.set(serverId, serverInfoObject);
        });
    } catch (error) {
        console.log(error);
    }
}

async function GetServerFilterSetting(serverId) {
    const cacheServerFilterInfo = await db.get(serverId);
    return cacheServerFilterInfo.filter_status;
}

async function SetServerFilterSetting(firedb, serverId, setting) {
    let success = true;

    try {
        const cacheServerFilteredWords = await GetServerFilterList(serverId);

        const serverFilterInfo = {
            filter_status: setting,
            filtered_words: cacheServerFilteredWords,
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

async function GetServerFilterList(serverId) {
    const cacheServerFilterInfo = await db.get(serverId);
    return cacheServerFilterInfo.filtered_words;
}

async function SetServerFilterList(firedb, serverId, list) {
    let success = true;

    try {
        const cacheServerFilterSetting = await GetServerFilterSetting(serverId);

        const serverFilterInfo = {
            filter_status: cacheServerFilterSetting,
            filtered_words: list,
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

async function RemoveServerFilteredWord(firedb, serverId, word) {
    let cacheServerFilteredWords = await GetServerFilterList(serverId);

    if(cacheServerFilteredWords.includes(word)) {
        cacheServerFilteredWords = cacheServerFilteredWords.filter(e => e !== word);
        const cacheServerFilterSetting = await GetServerFilterSetting(serverId);

        const serverFilterInfo = {
            filter_status: cacheServerFilterSetting,
            filtered_words: cacheServerFilteredWords,
        };

        db.set(serverId, serverFilterInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverFilterInfo);
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
        const cacheServerFilterSetting = await GetServerFilterSetting(serverId);

        const serverFilterInfo = {
            filter_status: cacheServerFilterSetting,
            filtered_words: cacheServerFilteredWords,
        };

        db.set(serverId, serverFilterInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverFilterInfo);
    }
}

async function GetServerFilterInfo(serverId) {
    return db.get(serverId);
}

async function InitializeNewServerFilter(firedb, serverId) {
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

module.exports = {
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
    SyncCachedServerFilterSettings,
    SetServerFilterSetting,
    AddServerFilteredWord,
    RemoveServerFilteredWord,
    GetServerFilterList,
    GetServerFilterSetting,
    SetServerFilterList,
    GetServerFilterInfo,
    InitializeNewServerFilter,
};

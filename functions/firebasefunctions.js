const fire = require('firebase/firestore');

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
};

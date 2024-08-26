const fire = require('firebase/firestore');
const utilities = require('./utilities.js');
const discordfunctions = require('./discordfunctions.js');
const logging = require('./logging.js');

// Local cache json database
const JSONdb = require('simple-json-db');
const { util } = require('prettier');
const { image } = require('image-downloader');
const db = new JSONdb('./cache/servers.json');

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

async function IncrementDailyChannelReadMessage(firedb, serverId, channelId, count, message, client, memberId, serverName) {
    let success = true;

    try {
        let serverInfo = await GetServerInfo(serverId);

        if (!serverInfo) {
            const channelList = await message.guild.channels.cache.values();
            const guild = await client.guilds.resolve(message.guild);
            const memberList = await guild.members.fetch().catch(console.error);
            await InitializeNewServer(firedb, message.guild.id, channelList, memberList, serverName);
            serverInfo = await GetServerInfo(serverId);
        }

        if ( !serverInfo.today_channels[channelId] )
            serverInfo.today_channels[channelId] = 0;

        if ( !serverInfo.today_members[memberId] )
            serverInfo.today_members[memberId] = 0;

        serverInfo.today_channels[channelId] = serverInfo.today_channels[channelId] += count;
        serverInfo.today_members[memberId] = serverInfo.today_members[memberId] += count;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function IncrementDailyServerCommandUsed(firedb, serverId, count) {
    let success = true;

    try {
        let serverInfo = await GetServerInfo(serverId);

        if ( !serverInfo.commands_today )
            serverInfo.commands_today = 0;

        serverInfo.commands_today = serverInfo.commands_today += count;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
}

async function IncrementServerFilteredMessages(firedb, serverId, count) {
    let success = true;

    try {
        let serverInfo = await GetServerInfo(serverId);

        if ( !serverInfo.filtered_messages )
            serverInfo.filtered_messages = 0;

        serverInfo.filtered_messages = serverInfo.filtered_messages += count;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
        success = false;
    }
    return success;
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

async function InitializeNewServer(firedb, serverId, channelList, memberList, guildName) {
    let success = true;

    try {
        let channelObj = {}, memberObj = {};
        let i = 0;

        // Add channels to server database
        for (var channel of channelList) {
            if (i === 0) guild = channel.guild.id;
            channelObj[channel.id] = channel.name;
            i++;
        }

        for (var member of memberList) {
            memberObj[member[1].user.id] = member[1].user.username;
        }

        const serverFilterInfo = {
            filter_status: false,
            filtered_words: [],
            reaction_role_messages: 0,
            today_channels: {},
            last_7_days_channels: [
                {}, {}, {}, {}, {}, {}, {}
            ],
            filtered_messages: 0,
            commands_today: 0,
            last_7_days_commands: 0,
            today_members: {},
            last_7_days_members: [
                {}, {}, {}, {}, {}, {}, {}
            ],
            channels: channelObj,
            members: memberObj,
            log_channel: '',
            server_name: guildName,
            filter_violations: {},
            max_violations: 10,
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

async function CheckYesterday(firedb) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterday = date.toISOString().split('T')[0];
    const docRef = await fire.doc(firedb, 'daily_stats', yesterday);
    const docSnap = await fire.getDoc(docRef);
    if (!docSnap.exists()) {
        await logging.log(firedb, 'There was no data in the database for yesterday. Rolling over data now.');
        await ResetDailyCommands(firedb, yesterday);
    }
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
        const messagesToday = await GetTotalDailyMessages();
        const messaging = fire.query(fire.collection(firedb, 'messaging'));
        const querySnapshotMessaging = await fire.getDocs(messaging);
        querySnapshotMessaging.forEach(async doc => {
            const data = doc.data();

            const currentMessagingInfo = {
                index: data.daily,
            };

            messagingInfo[doc.id] = currentMessagingInfo;

            if (doc.id === 'messages_read') {
                data.index = data.index + messagesToday;
                data.daily = 0;
            } else {
                data.index = data.index + data.daily;
                data.daily = 0;
            }

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

        await RolloverDailyServerInfo(firedb);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function RolloverDailyServerInfo(firedb) {
    const data = db.JSON();

    for (const key in data) {   // key is server id
        let channelDataToday = data[key].today_channels;

        let commandDataToday = data[key].commands_today;

        let last7Days = data[key].last_7_days_channels;

        if (!last7Days) {
            last7Days = [{}, {}, {}, {}, {}, {}, {}];
        }

        let last7DaysCommands = data[key].last_7_days_commands;

        if (!last7DaysCommands) {
            last7DaysCommands = [0, 0, 0, 0, 0, 0, 0];
        }

        let last7DaysMembers = data[key].last_7_days_members;

        if (!last7DaysMembers) {
            last7DaysMembers = [{}, {}, {}, {}, {}, {}, {}];
        }

        // Add newest data to array and replace old
        last7Days.unshift(channelDataToday ? channelDataToday : {});
        last7Days.pop();

        last7DaysCommands.unshift(commandDataToday ? commandDataToday : 0);
        last7DaysCommands.pop();

        last7DaysMembers.unshift(data[key].today_members ? data[key].today_members : {});
        last7DaysMembers.pop();

        // Set new server info
        let serverInfo = await GetServerInfo(key);
        serverInfo.today_channels = {};
        serverInfo.last_7_days_channels = last7Days;
        serverInfo.last_7_days_commands = last7DaysCommands;
        serverInfo.commands_today = 0;
        serverInfo.today_members = {};
        db.set(key, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', key);
        await fire.setDoc(docRef, serverInfo);
    }
}

async function GetTotalDailyMessages() {
    let total = 0;
    const data = db.JSON();

    for (const key in data) {
        let serverData = data[key].today_channels;
        for (const key2 in serverData) {
            total += serverData[key2];
        }
    }

    return total;
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

async function AddMemberToServer(firedb, serverId, userId, userName) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.members[userId] = userName;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function RemoveMemberFromServer(firedb, serverId, userId) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        delete serverInfo.members[userId];

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function AddChannelToServer(firedb, serverId, channelId, channelName) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.channels[channelId] = channelName;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function RemoveChannelFromServer(firedb, serverId, channelId) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        delete serverInfo.channels[channelId];

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function UpdateChannelInServer(firedb, serverId, oldChannelId, newChannelId, newChannelName) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        delete serverInfo.channels[oldChannelId];

        serverInfo.channels[newChannelId] = newChannelName;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetChannelList(firedb, serverId, channelList) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.channels = channelList;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetMemberList(firedb, serverId, memberList) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.members = memberList;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetServerName(firedb, serverId, name) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.server_name = name;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function GetLogChannel(firedb, serverId) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);
        return serverInfo ? (serverInfo.log_channel ? serverInfo.log_channel : '') : '';
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetLogChannel(firedb, serverId, channelId) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.log_channel = channelId;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetServerFilterViolationsList(firedb, serverId, list) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.filter_violations = list;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function GetServerFilterViolationsList(firedb, serverId) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        return serverInfo.filter_violations;
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function IncrementUserFilterViolations(firedb, serverId, userId, count = 1) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        if (serverInfo.filter_violations[userId]) {
            serverInfo.filter_violations[userId] = serverInfo.filter_violations[userId] + count;
        } else {
            serverInfo.filter_violations[userId] = count;
        }

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetUserFilterViolations(firedb, serverId, userId, count) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        if (count === 0) {
            delete serverInfo.filter_violations[userId];
        } else {
            serverInfo.filter_violations[userId] = count;
        }

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function GetUserViolations(firedb, serverId, userId) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        return serverInfo.filter_violations[userId] ? serverInfo.filter_violations[userId] : 0;
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function SetUserViolationsMax(firedb, serverId, num) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        serverInfo.max_violations = num;

        db.set(serverId, serverInfo);

        const docRef = await fire.doc(firedb, 'servers', serverId);
        await fire.setDoc(docRef, serverInfo);
    } catch (error) {
        logging.error(firedb, error);
    }
}

async function GetUserViolations(firedb, serverId, userId) {
    try {
        let serverInfo = await GetServerFilterInfo(serverId);

        return serverInfo.max_violations;
    } catch (error) {
        logging.error(firedb, error);
    }
}

module.exports = {
    SetCloudData,
    DeleteFirebaseDocument,
    IncrementDaily,
    IncrementDailyChannelReadMessage,
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
    GetTotalDailyMessages,
    RolloverDailyServerInfo,
    IncrementDailyServerCommandUsed,
    IncrementServerFilteredMessages,
    AddMemberToServer,
    RemoveMemberFromServer,
    AddChannelToServer,
    RemoveChannelFromServer,
    UpdateChannelInServer,
    SetChannelList,
    SetMemberList,
    SetServerName,
    GetLogChannel,
    SetLogChannel,
    CheckYesterday,
    SetServerFilterViolationsList,
    GetServerFilterViolationsList,
    IncrementUserFilterViolations,
    SetUserFilterViolations,
    GetUserViolations,
    SetUserViolationsMax,
};

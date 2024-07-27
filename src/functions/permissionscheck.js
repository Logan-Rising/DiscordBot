// Checking if a user and server combination is valid for a request
function checkValidSend(command, userId, serverId, userIsAdmin) {
    if (checkUser(command.users, userId, userIsAdmin) && checkServer(command.servers, serverId)) return true;
    return false;
}

// Checking if the server requested for a message is valid
function checkServer(serverList, serverId) {
    if (serverList.length === 0) {
        // No server restrictions
        return true;
    } else if (serverList.includes(serverId)) {
        // Server restrictions and server is in the list
        return true;
    } else {
        return false;
    }
}

// Checking if a user request is valid based on permissions
function checkUser(userList, userId, admin) {
    if (userList.length === 0) {
        // No user restrictions
        return true;
    } else if (admin && userList.includes('admin')) {
        // Admin restriction and user is admin
        return true;
    } else if (userList.length != 0 && userList.includes(userId)) {
        // User restriction and user is in the list
        return true;
    } else {
        return false;
    }
}

module.exports = {
    checkValidSend,
};

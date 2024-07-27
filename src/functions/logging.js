const databasefunctions = require('./databasefunctions.js');

async function log(firedb, content) {
    await databasefunctions.IncrementIndex(firedb, 1, 'console', 'log');
    console.log(content);
}

async function error(firedb, content) {
    await databasefunctions.IncrementIndex(firedb, 1, 'console', 'error');
    console.error(content);
}

async function warn(firedb, content) {
    await databasefunctions.IncrementIndex(firedb, 1, 'console', 'warn');
    console.warn(content);
}

async function info(firedb, content) {
    await databasefunctions.IncrementIndex(firedb, 1, 'console', 'info');
    console.info(content);
}

module.exports = {
    log,
    error,
    warn, 
    info
};
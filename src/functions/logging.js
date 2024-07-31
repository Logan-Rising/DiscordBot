async function log(firedb, content) {
    console.log(content);
}

async function error(firedb, content) {
    console.error(content);
}

async function warn(firedb, content) {
    console.warn(content);
}

async function info(firedb, content) {
    console.info(content);
}

module.exports = {
    log,
    error,
    warn,
    info,
};

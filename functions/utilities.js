const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

module.exports = {
    sleep,
};
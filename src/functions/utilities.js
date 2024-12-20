const fs = require('fs');

const sleep = async(n) => new Promise(async resolve => setTimeout(resolve, n));

async function WaitForFile(path, timeout = 2000) {
    let totalTime = 0;
    let checkTime = timeout / 10;

    return await new Promise((resolve, reject) => {
        const timer = setInterval(function () {
            totalTime += checkTime;

            let fileExists = fs.existsSync(path);

            if (fileExists || totalTime >= timeout) {
                clearInterval(timer);

                resolve(fileExists);
            }
        }, checkTime);
    });
}

function GetDateNoTime() {
    const tempdate = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
    let arr = tempdate.split(',')[0].split('/');
    return (arr[2] + '-' + arr[0].padStart(2, '0') + '-' + arr[1].padStart(2, '0'));
}

// function GetDateNoTime() {
//     const d = new Date().toISOString().split('T')[0];
//     return d;
// }

function GetCurrentEstDate() {
    var now = new Date(
        new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
    );
}

// https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript/67462589#67462589
// Function's sheer purpose is for formatting for output debugging
function formatMilliseconds(milliseconds, padStart) {
    function pad(num) {
        return `${num}`.padStart(2, '0');
    }
    let asSeconds = milliseconds / 1000;

    let hours = undefined;
    let minutes = Math.floor(asSeconds / 60);
    let seconds = Math.floor(asSeconds % 60);

    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        minutes %= 60;
    }

    return hours
        ? `${padStart ? pad(hours) : hours}:${pad(minutes)}:${pad(seconds)}`
        : `${padStart ? pad(minutes) : minutes}:${pad(seconds)}`;
}

module.exports = {
    sleep,
    WaitForFile,
    GetDateNoTime,
    GetCurrentEstDate,
    formatMilliseconds,
};

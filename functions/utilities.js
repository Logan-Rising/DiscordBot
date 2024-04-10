const fs = require('fs');

const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

async function WaitForFile(path, timeout = 2000)
{
    let totalTime = 0; 
    let checkTime = timeout / 10;

    return await new Promise((resolve, reject) => {
        const timer = setInterval(function() {

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
    const d = new Date().toISOString().split('T')[0];
    return d;
}

module.exports = {
    sleep,
    WaitForFile,
    GetDateNoTime,
};
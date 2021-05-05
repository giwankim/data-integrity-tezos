const fs = require('fs');

async function openLog(logPath) {
    try {
        const csvHeaders = 'filename,integrity';
        await fs.promises.writeFile(logPath, csvHeaders);
    } catch (error) {
        console.error(`Got an error trying to write to logfile: ${error.message}`);
    }
}

async function addLog(logPath, filePath, integrity) {
    try {
        const csvLine = `\n${filePath},${integrity}`;
        await fs.promises.writeFile(logPath, csvLine, { flag: 'a' });
    } catch (error) {
        console.error(`Got an error trying to write to a file: ${error.message}`);
    }
}

// const path = require('path');
// const logPath = path.join(__dirname, 'log.log');
// (async function () {
//     await openLog(logPath);
//     await addLog(logPath, logPath, true);
//     await addLog(logPath, logPath, false);
// })();

module.exports = {
    openLog: openLog,
    addLog: addLog,
};

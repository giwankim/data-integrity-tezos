const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}

async function listDir(folderPath) {
    return fs.readdirSync(folderPath).map(fileName => {
        return path.join(folderPath, fileName);
    })
    .filter(isFile);
}

// const logPath = path.join(__dirname, 'log.log');
// (async function () {
//     await openLog(logPath);
//     await addLog(logPath, logPath, true);
//     await addLog(logPath, logPath, false);
// })();
// (async function() {
//     files = await listDir('.');
//     console.log(files);
// })();

module.exports = {
    openLog: openLog,
    addLog: addLog,
    listDir: listDir,
};

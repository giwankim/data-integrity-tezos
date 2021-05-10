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

function listDir(folderPath) {
    return fs.readdirSync(folderPath)
        .map(fileName => {
            return path.join(folderPath, fileName);
        })
        .filter((fileName) => {
            return fs.lstatSync(fileName).isFile();
        });
}

function checksum(filePath, algorithm = 'sha256') {
    const data = fs.readFileSync(filePath).toString();
    return crypto
        .createHash(algorithm)
        .update(data)
        .digest('hex');
}

function generateId(filePath, algorithm = 'sha256') {
    const basename = path.basename(filePath);
    const stats = fs.statSync(filePath);
    const str = `${basename}|${stats.size}|${stats.mtime}`;
    return crypto
        .createHash(algorithm)
        .update(str)
        .digest('hex');
}

module.exports = {
    openLog: openLog,
    addLog: addLog,
    listDir: listDir,
    checksum: checksum,
    generateId: generateId,
};

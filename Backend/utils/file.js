const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { UptimeLogs } = require('../Database/models');

const addLocalFile = async (folder, filePath, data, mode) => {
    if (!fs.existsSync(path.join(__dirname, '..', folder))) {
        await fsPromises.mkdir(path.join(__dirname, '..', folder));
    }
    if (mode === 'overwrite') {
        try {
            return await fsPromises.writeFile(filePath.join(__dirname, '..', folder, filePath), data);
        } catch (err) {
            return err;
        }
    }
    else {
        fsPromises.appendFile((path.join(__dirname, '..', folder, filePath)), data);
    }
}

const createFile = async (folder, filePath, data, mode) => {
    if (process.env._ && process.env._.indexOf("heroku") !== -1) {
        switch (filePath) {
            case 'uptime.txt':
                const newUptimeLog = new UptimeLogs({ ...data });
                newUptimeLog.save((err) => {
                    if (err)
                        console.log(err)
                    else
                        console.log('UptimeLogs saved');
                });
                break;
            case 'error.txt':
                const newErrorLog = new UptimeLogs({ ...data });
                newErrorLog.save((err) => {
                    if (err)
                        console.log(err)
                    else
                        console.log('ErrorLogs saved');
                });
                break;
            case 'submission.txt':
                const newSubmissionLog = new UptimeLogs({ ...data });
                newSubmissionLog.save((err) => {
                    if (err)
                        console.log(err)
                    else
                        console.log('SubmissionLogs saved');
                });
        }
    }
    else {
        addLocalFile(folder, filePath, data, mode);   
    }
}

module.exports = { createFile };
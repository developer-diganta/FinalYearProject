const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { UptimeLogs } = require('../Database/models');

const createFile = async (folder, filePath, data, mode) => {
    if (process.env._ && process.env._.indexOf("heroku") !== -1) {
        const newUptimeLog = new UptimeLogs({ ...data });
        newUptimeLog.save((err) => {
            if (err)
                console.log(err)
            else
                console.log('UptimeLogs saved');
        });
    }
    else {
        if (!fs.existsSync(path.join(__dirname, '..', folder))) {
                    await fsPromises.mkdir(path.join(__dirname, '..', folder));
        }
        if (mode === 'overwrite') {
            try {
                return await fsPromises.writeFile(filePath.join(__dirname, '..', folder, filePath), data);
            } catch(err){
                return err;
            }
        }
        else {
            fsPromises.appendFile((path.join(__dirname, '..', folder, filePath)), data);
        }
        
    }
}

module.exports = { createFile };
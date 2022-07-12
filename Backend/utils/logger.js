const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const event = require('./events');
const { v4: uuid } = require('uuid');
const os = require('os');
const {createFile} = require('./file');

eventEmitter.on('log', ({folder, filePath, data, mode}) => {
    createFile(folder, filePath, data, mode);
});

const addUptimeLog = (msg) => {
    const uniqid = uuid();
    const time = new Date().toLocaleString();
    const uptime = os.uptime();
    let data=null;
    if (process.env._ && process.env._.indexOf("heroku") !== -1)
         data = {
            time: time,
            id: uniqid,
            uptime: uptime,
            status: msg
        }
    else
        data = `${time}\t${uniqid}\t${uptime}\t${msg}\n`;
    
    eventEmitter.emit('log', { folder: 'logs', filePath: 'uptime.txt', data: data, mode: 'append' })
};

module.exports = {addUptimeLog};

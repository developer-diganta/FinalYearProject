const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const {createFile} = require('./file');

eventEmitter.on('log', (folder, filePath, data, mode) => {
    createFile(folder, filePath, data, mode);
});

module.exports = {eventEmitter};
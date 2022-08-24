const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const {createFile} = require('./file');

// Flow of control for adding logs - event emitter
// as per event, call function


//calls create file with requiste data
eventEmitter.on('log', (folder, filePath, data, mode) => {
    createFile(folder, filePath, data, mode);
});

module.exports = {eventEmitter};
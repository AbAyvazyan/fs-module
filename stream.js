const fs = require('fs');
const { Transform, Readable, Writable } = require('stream');
const http = require('http');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');

// 1. Basic Stream Operations

// With Pipes
const readStreamWithPipes = fs.createReadStream('input.txt', 'utf8');
const writeStreamWithPipes = fs.createWriteStream('output_with_pipes.txt');
readStreamWithPipes.pipe(writeStreamWithPipes);

readStreamWithPipes.on('end', () => {
    console.log('File copy with pipes completed.');
});

// Without Pipes
const readStreamWithoutPipes = fs.createReadStream('input.txt', 'utf8');
const writeStreamWithoutPipes = fs.createWriteStream('output_without_pipes.txt');

readStreamWithoutPipes.on('data', (chunk) => {
    writeStreamWithoutPipes.write(chunk);
});

readStreamWithoutPipes.on('end', () => {
    writeStreamWithoutPipes.end();
    console.log('File copy without pipes completed.');
});

// 2. Transform Streams Homework

const transformStream = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
        try {
            let obj = JSON.parse(chunk.toString());
            obj.timestamp = new Date().toISOString();
            callback(null, JSON.stringify(obj));
        } catch (err) {
            callback(err);
        }
    }
});

const readStreamForTransform = fs.createReadStream('input.json', { encoding: 'utf8' });
const writeStreamForTransform = fs.createWriteStream('output.json');

readStreamForTransform.pipe(transformStream).pipe(writeStreamForTransform);

writeStreamForTransform.on('finish', () => {
    console.log('Transform stream completed.');
});

// 3. Implementing Basic Back Pressure

const readableStream = new Readable({
    read() {
        this.push('Data chunk\n');
        this.push('More data\n');
        this.push(null);
    }
});

const writableStream = new Writable({
    write(chunk, encoding, callback) {
        setTimeout(() => {
            console.log(`Writing: ${chunk.toString()}`);
            callback();
        }, 1000);
    }
});

readableStream.pipe(writableStream);

// 4. HTTP Streaming

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/large-file', (req, res) => {
    const readStream = fs.createReadStream('largefile.txt');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    readStream.pipe(res);
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

// 5. Real-time Data Processing (Optional)

io.on('connection', (socket) => {
    console.log('A user connected');

    setInterval(() => {
        socket.emit('data', { timestamp: new Date().toISOString(), value: Math.random() });
    }, 1000);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

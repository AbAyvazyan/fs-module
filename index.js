const fs = require('fs');
const path = require('path');


fs.writeFileSync('example.txt', 'Hello, World!');
console.log('Task 1.1: File created and string written!');


fs.appendFileSync('example.txt', ' This is Node.js FS module.');
console.log('Task 1.2: String appended to file!');


const exampleData = fs.readFileSync('example.txt', 'utf8');
console.log('Task 1.3: File content: ', exampleData);


fs.mkdirSync('testDir');
console.log('Task 2.1: Directory created!');


const testFilePath = path.join(__dirname, 'testDir', 'testFile.txt');
fs.writeFileSync(testFilePath, 'This is some text.');
console.log('Task 2.2: File created and text written!');


const renamedFilePath = path.join(__dirname, 'testDir', 'renamedFile.txt');
fs.renameSync(testFilePath, renamedFilePath);
console.log('Task 2.3: File renamed!');


fs.unlinkSync(renamedFilePath);
fs.rmdirSync('testDir');
console.log('Task 2.4: File and directory deleted!');


fs.writeFileSync('syncFile.txt', 'Hello, World! This is synchronous.');
console.log('Task 3.1: Synchronous file written!');

const syncData = fs.readFileSync('syncFile.txt', 'utf8');
console.log('Task 3.1: Synchronous read: ', syncData);


fs.writeFile('asyncFile.txt', 'Hello, World! This is asynchronous.', (err) => {
    if (err) throw err;
    console.log('Task 3.2: Asynchronous file written!');

    fs.readFile('asyncFile.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log('Task 3.2: Asynchronous read: ', data);
    });
});


const jsonData = fs.readFileSync('data.json', 'utf8');
const users = JSON.parse(jsonData);
console.log('Task 4.1: Initial data:', users);


users.push({name: 'Alice', age: 22});
fs.writeFileSync('data.json', JSON.stringify(users, null, 2));
console.log('Task 4.2: New user added and file updated!');


if (!fs.existsSync('watchDir')) {
    fs.mkdirSync('watchDir');
}
console.log('Task 5.1: Directory created for watching.');

fs.watch('watchDir', (eventType, filename) => {
    if (filename) {
        console.log(`Task 5.2: ${eventType} event occurred on file: ${filename}`);
    } else {
        console.log('Task 5.2: Filename not provided');
    }
});


try {
    const data = fs.readFileSync('nonexistentFile.txt', 'utf8');
    console.log('Task 6: ', data);
} catch (err) {
    console.error('Task 6: Error reading file:', err.message);
}


function listFilesRecursively(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            listFilesRecursively(fullPath);
        } else {
            console.log('Task 7.1: ', fullPath);
        }
    });
}

listFilesRecursively(__dirname);


function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

copyDir('sourceDir', 'destinationDir');
console.log('Task 7.2: Directory copied successfully!');


const stats = fs.statSync('example.txt');
console.log('Task 8.1: File metadata:', stats);

fs.chmodSync('example.txt', 0o444);
console.log('Task 8.2: File permissions changed to read-only!');

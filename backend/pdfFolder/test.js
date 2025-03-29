import fs from 'fs';

const dir_Path = '../../backend';

const listFiles = fs.readdirSync(dir_Path);
console.log(listFiles);

#!/usr/bin/env node

const fs = require('fs');
const archiver = require('archiver');
const { shell } = require('execa');

function zip(files = []) {
  const output = fs.createWriteStream('./git-staged.zip');
  const archive = archiver('zip');
  archive.on('error', err => {
    throw err;
  });
  archive.pipe(output);
  files.forEach(name => {
    archive.file(name, { name });
  });
  archive.finalize();
  console.log('Done!');
}

shell('git diff --staged --name-only')
  .then(({ stdout }) => stdout.split(/\n/))
  .then(list => {
    if(list.length){
      zip(list);
    }
  });

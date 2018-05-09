const fs = require('fs');
const cache = {}; 
// cache['file1.txt'] = 'Michael Node.js Expert (Cached)'
function inconsistentRead(filename, callback) { 
  if(cache[filename]) { 
    //invoked synchronously 
    callback(cache[filename]);   
  } else { 
    //asynchronous function 
    fs.readFile(filename, 'utf8', (err, data) => { 
      cache[filename] = data; 
      callback(data); 
    }); 
  } 
}

// inconsistentRead('file1.txt', (data) => { console.log(data)});


function createFileReader(filename) {
  const listeners = [];
  inconsistentRead(filename, value => {
    listeners.forEach(listener => listener(value));
  });
  return {
    onDataReady: listener => listeners.push(listener)
  };
}

// NOT WORKING
const reader1 = createFileReader('data.txt'); 
reader1.onDataReady(data => {
  console.log('NOT WORKING second file read');
  console.log('First call data: ' + data); 
  //...sometime later we try to read again from 
  //the same file 
  const reader2 = createFileReader('data.txt'); 
  reader2.onDataReady( data => { 
    console.log('Second call data: '
      + data); 
  }); 
});

// setTimeout(() => {
//   const reader2 = createFileReader('data.txt'); 
//   reader2.onDataReady( data => { 
//     console.log('Second call data: '
//       + data); 
//   });
// }, 1000);


// WORKING
function createFileReader2(filename, newListener) {
  const listeners = [];
  listeners.push(newListener);
  inconsistentRead(filename, value => {
    listeners.forEach(listener => listener(value));
  });
}

const reader21 = createFileReader2('data.txt', data => {
  console.log('WORKING');
  console.log('First call data: ' + data);
  const reader22 = createFileReader2('data.txt', data => {
    console.log('Second call data: ' + data);
  });
}); 

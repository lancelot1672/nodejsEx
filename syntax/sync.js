var fs = require('fs');

//readFileSync
console.log('A');
// return
var result = fs.readlinkSync('sample.txt','utf8');
console.log(result);
console.log('C');

//readFile
console.log('A');
//no return
fs.readFile('syntax/sample.txt', 'utf-8', function(err, result){
    console.log(result);
});
console.log('C');
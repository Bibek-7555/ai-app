let buf1 = Buffer.from("ABCDE"); // String
let buf2 = Buffer.from([1, 2, 3]); // Array
let buf3 = Buffer.from(buf1); // Buffer

console.log(buf1); // <Buffer 41 42 43 44 45>
console.log(buf2); // <Buffer 01 02 03> 
console.log(buf3); // <Buffer 41 42 43 44 45>
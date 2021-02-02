const xlsx       = require('xlsx');

//xlsx
var wb = xlsx.readFile("./Input/Data/data.xlsx")
// console.log(wb.SheetNames)
var ws = wb.Sheets["Sheet1"]
// console.log(ws)
// var data = xlsx.utils.sheet_to_json(ws)
var data = xlsx.utils.sheet_to_json(xlsx.readFile("./Input/Data/data.xlsx").Sheets["Sheet1"])
console.log(data[data.length-1])
// console.log(data[1])
// console.log(data.length)

// var newdata= data.map((record)=>{
//     console.log(record.User)
// // })
// console.log(data)
// console.log("---"+data[data.length-1].User)
// console.log("---"+data[data.length-1].Content)
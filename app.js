var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require("superagent");
var price;
var amount;
var sellPrice;
var buyPrice;
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(8080,  () => {
  console.log('listening on port ', 8080);
});

getPrice();

function getPrice(){
  setTimeout(() => {
    request.get("https://blockchain.info/ticker",(err,data) => {
      console.log("Bitcoin price: $NZD", data.body.NZD.buy);
      price = data.body.NZD.buy;
      getPrice();
    })
  },5000)
}

//
// rl.question("How much bitcoin would you like the bot to trade with?", (answer) => {
//   console.log("You Selected: ", answer);
//   amount = answer;
//   rl.close();
// });
//
// rl.question("What price would you like to buy at?", (answer) => {
//   console.log("You Selected: ", answer);
//   buyPrice = answer;
//   rl.close();
// });
//
// rl.question("What price would you like to sell at?", (answer) => {
//   console.log("You Selected: ", answer);
//   sellPrice = answer;
//   rl.close();
// });
//
// var bought = false;
//
// function buy(){
//
// }
//
// var sold = false;
//
// function sell(){
//
// }


module.exports = app;

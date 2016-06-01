//modules
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require("superagent");
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
//global variables
var price,
amount,
sellPrice,
buyPrice,
sold = false,
bought = false

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

getPrice();
askUser("How much bitcoin would you like to trade from your account?","amount");

function getPrice(){
  setTimeout(() => {
    request.get("https://blockchain.info/ticker",(err,data) => {
      price = data.body.NZD.buy;
      console.log("\nBitcoin price: $NZD", data.body.NZD.buy);
      if(price == buyPrice && !bought) buy()
      if(price == sellPrice && !sold) sell()
      getPrice();
    })
  },5000)
}

function askUser(question,variable){

  rl.question(question + ": ", (answer) => {
    console.log("You Selected: ", answer);
    if(variable == "amount"){
      amount = answer;
      askUser("what would you like to buy at? (in $NZD)", "buyPrice");
    }
    else if(variable == "buyPrice"){
      buyPrice = answer;
      askUser("what would you like to sell at? (in $NZD)", "sellPrice");
    }
    else{
      sellPrice = answer;
      askUser("hit ctrl c to abort", null);
    }
    // rl.close();
  });
}

function buy(){
  console.log("Buying " + amount + " bitcoin(s) at the price of $" + buyPrice)
  trade(amount,"buy");
  bought = true; //stops buying amount of bitcoin but allows you to sell
  sold = false;
}

function sell(){
  console.log("Selling " + amount + " bitcoin(s) at the price of $" + sellPrice)
  trade(amount,"sell");
  sold = true; //stops selling but allows buying
  bought = false;
}

function trade(amount,type){
  console.log("trade initiated!");
}

module.exports = app;

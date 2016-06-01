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
bought = false,
username,
password

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

getPrice();
askUser("please enter your bter.com username","username");

function getPrice(){
  setTimeout(() => {
    request.get("https://blockchain.info/ticker",(err,data) => {
      price = data.body.USD.buy;
      // console.log("\nBitcoin price: $USD", data.body.USD.buy);
      if(price == buyPrice && !bought) buy()
      if(price == sellPrice && !sold) sell()
      getPrice();
    })
  },5000)
}

function askUser(question,variable){

  rl.question(question + ": ", (answer) => {
    console.log("You Selected: ", answer);
    if(variable == "username"){
      username = answer;
      askUser("please enter your password","password");
    }
    else if(variable == "password"){
      password = answer;
      askUser("How much bitcoin would you like to trade from your account?","amount");
    }
    else if(variable == "amount"){
      amount = answer;
      askUser("what would you like to buy at? (in $USD)", "buyPrice");
    }
    else if(variable == "buyPrice"){
      buyPrice = answer;
      askUser("what would you like to sell at? (in $USD)", "sellPrice");
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
  bought = true; //stops buying but allows selling of specified amount
  sold = false;
}

function sell(){
  console.log("Selling " + amount + " bitcoin(s) at the price of $" + sellPrice)
  trade(amount,"sell");
  sold = true; //stops selling but allows buying of specified amount
  bought = false;
}

function trade(amount,type){
  console.log("trade initiated!");
  var query = "https://bter.com/api/1/private/placeorder?pair=$usd_btc" + password;
  query += "&type=$" + type + "&rate=$" + price + "&amount=" + amount;
  app.post(query, (err,data) => {
    if (err) throw err;
    console.log("here is the data from the API: ", data)
  })
}

module.exports = app;

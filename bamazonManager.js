//import libraries
'use strict';
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// mySQL config variable
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: '1111',
    database: "Bamazon"
});

const commands = {
  "View Products for Sale": viewProductsForSale,
  "View Low Inventory": viewLowInventory,
  "Add to Inventory": addToInventory,
  "Add New Product": addNewProduct,
  "** Exit **": exitApp
};

//show user list of actions
//based on user input runs appropriate function.
function askQuestions(params) {
    inquirer.prompt([{
        type: 'list',
        name: 'input',
        message: 'Manager menu options:',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', "** Exit **"]
    }]).then((action) => {
      if (!commands[action.input] === undefined) {
        commands[action.input]();
      }
    });
};


function printAllData(queryString, myItemProcesser) {

    // Querying database for all data
    //Using INNER JOIN for selecting department name based on department_id from products table
    connection.query(queryString,
        (err, items) => {
            if (err) {
                throw err;
            }
            else {
                items.forEach((data) => {
                    myItemProcesser.addItem(data);
                    
                });
                console.log(myItemProcesser.table.toString())
            }
        });

};

//this object makes the table processing generic.  
//the itemProcFunc or item Processing Function will process a function in accordance to cli-table, and return the table 
//the cli-table will take the result and add to table.  
function itemProcesser (table, itemProcFunc) {
  this.table = table;
  this.itemProcFunc = itemProcFunc;
  this.addItem = function (item) {
    var elem = this.itemProcFunc(item);
    this.table.push(elem);
  }
}
//this function should list every available items: item IDS, names, prices and quantities
function viewProductsForSale() {
  var connection_string = "SELECT item_id, product_name, price, stock_quantity from products";
  var table = new Table({head: ["Id", "Name", "Price", "Stock Quantity"]});
  var itemTablePrinter = new itemProcesser(table, function(data) {
    var elem = [];
    elem.push(data.item_id, data.product_name, data.price, data.stock_quantity);
    return elem;
  });

  printAllData(connection_string, itemTablePrinter);

}

function viewLowInventory() {}
function addToInventory() {}
function addNewProduct() {}
function exitApp() {
  connection.end();
}

//askQuestions();
viewProductsForSale();
exitApp();
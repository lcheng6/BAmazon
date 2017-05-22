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
      // if (!commands[action.input] === undefined) {
      //   commands[action.input]();
      // }
      var command = commands[action.input]
      command();
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
                console.log("");
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
  console.log("within viewProductsForSale")
  var connection_string = "SELECT item_id, product_name, price, stock_quantity from products";
  var table = new Table({head: ["Id", "Name", "Price", "Stock Quantity"]});
  var itemTablePrinter = new itemProcesser(table, function(data) {
    var elem = [];
    elem.push(data.item_id, data.product_name, data.price, data.stock_quantity);
    return elem;
  });

  printAllData(connection_string, itemTablePrinter);
  askQuestions();

}

//this function should list every available items: item IDS, names, prices and quantities for items whose quantity is lower than 5
function viewLowInventory() {
  var connection_string = "SELECT item_id, product_name, price, stock_quantity from products where stock_quantity < 5 ";
  var table = new Table({head: ["Id", "Name", "Price", "Stock Quantity"]});
  var itemTablePrinter = new itemProcesser(table, function(data) {
    var elem = [];
    elem.push(data.item_id, data.product_name, data.price, data.stock_quantity);
    return elem;
  });

  printAllData(connection_string, itemTablePrinter);
  askQuestions();

} 

function addToInventory() {

  inquirer.prompt([{
            type: 'input',
            name: 'id',
            message: 'Enter item ID:',
        }, {
            type: "input",
            name: "amount",
            message: "How many items you want to add?"
        }]).then((action) => {
            //update product quantity based on id
            connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?', [action.amount, action.id], (err) => {
                if (err) throw err
                else console.log('Items quantity was successfully updated!');
                console.log('******************************************************************');
                askQuestions();
            });
        });

}

function addNewProduct() {
    inquirer.prompt([{
            type: 'input',
            name: 'item_name',
            message: 'Enter item name:',
        }, {
            type: "input",
            name: "dep_id",
            message: "Enter department ID:"
        }, {
            type: "input",
            name: "price",
            message: "Enter price:"
        }, 
        {
            type: "input",
            name: "stock_quantity",
            message: "Enter stock quantity:"
        }, 
        {
            type: "input",
            name: "product_sales",
            message: "Enter product sales:"
        }
        ]).then((action) => {
            //update product quantity based on id
            connection.query('INSERT INTO products(product_name, department_id, price, stock_quantity,product_sales) VALUES (?,?,?,?,0)', [action.item_name, action.dep_id, action.price, action.stock_quantity, action.product_sales, 0], (err) => {
                if (err) throw err
                else console.log('Item was successfully inserted!');
                console.log('******************************************************************');
                askQuestions();
            });
        });
}
function exitApp() {
  connection.end();
}


askQuestions();

//import libraries
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

getAllData();

// get all items from database
function getAllData() {
    //table variable for printing database data nicely
    var table = new Table({ head: ["Id", "Name", "Department", "Price", "Stock Quantity", "Product Sales"] });

    // Querying database for all data
    //Using INNER JOIN for selecting department name based on department_id from products table
    connection.query("SELECT products.item_id, products.product_name, departments.department_name, products.price, products.stock_quantity, products.product_sales FROM products INNER JOIN departments ON products.department_id = departments.department_id",
        (err, items) => {
            if (err) throw err;
            items.forEach((data) => {
                var elem = [];
                elem.push(data.item_id, data.product_name, data.department_name, data.price, data.stock_quantity, data.product_sales);
                table.push(elem);
            });
            console.log(table.toString());
            showQuestions();

        });
};

// ask user about an id and amount of items user wants to buy
// based on user input run checkQuantity function
function showQuestions() {
    inquirer.prompt([{
            type: "input",
            name: "id",
            message: "Enter an id of item you would like to buy.",
        },
        {
            type: "input",
            name: "amount",
            message: "how many units would like to buy?"
        }
    ]).then((ans) => {
        if (!ans.id.match('[0-9]+') ) {
            console.log("Must enter integer for input");
        }else {
            try {
                checkQuantity(ans.amount, ans.id);
            }
            catch (err) {
                console.log("Failed to locate the item")
                console.log("error: " + error)
            }
            
        }
        
    });
};

//check amount of items user entered
//if more than available print appropriate message.
//else run functions which updating product quantity, product sales and product sales in department table.
function checkQuantity(userQuantity, itemId) {
    connection.query("SELECT stock_quantity, price, department_id FROM products WHERE item_id = ?", itemId, (err, row) => {
        if (err) throw err;
        var productQuantity = row[0].stock_quantity;
        var price = row[0].price;
        var depId = row[0].department_id;
        if (productQuantity < userQuantity) {
            console.log('Insufficient quantity!');
            showQuestions();
        } else {
            var total = price * userQuantity;
            console.log('Total for this transaction is: ' + total + "$");
            updateQuantity(itemId, productQuantity - userQuantity);
            updateItemSales(itemId, total);
            updateDepartmentSales(depId, total);
        };
    });
};

//function update product quantity
//accept product id and quantity
function updateQuantity(itemId, quantity) {
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [quantity, itemId], (err) => {
        if (err) throw err
        else console.log('Your order was successfully placed!');
    });
};

//function update product sales in products table
//accept product id and total price for purchase
function updateItemSales(itemId, total) {
    connection.query('UPDATE products SET product_sales = product_sales + ? WHERE item_id = ?', [total, itemId], (err) => {
        if (err) throw err
        else console.log('Product total sales updated');
    });
}

//function update product sales in department table
//accept department id and total price for purchase
function updateDepartmentSales(depId, total) {
    connection.query('UPDATE departments SET total_sales = total_sales + ? WHERE department_id = ?', [total, depId], (err) => {
        if (err) throw err
        else console.log('Department total sales updated');
        getAllData();
    });

}
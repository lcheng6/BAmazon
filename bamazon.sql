CREATE DATABASE Bamazon;
use Bamazon;

CREATE TABLE products(
	item_id INT(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_id INT(10),
    price DECIMAL(10,2),
    stock_quantity INT(8),
    product_sales DECIMAL(10,2),
    PRIMARY KEY(item_id)
);


CREATE TABLE departments(
	department_id INT(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30),
    over_head_cost DECIMAL(10,2),
    total_sales DECIMAL(10,2),
    PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_cost, total_sales)
VALUES
	('Home Appliance',1000,0),
    ('Grocery',3000,0),
    ('Cutlery',100,0),
    ('Bakery',20,0),
    ('Pharmacy', 5000, 0);
    


INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES
	('Washing Machine', 1, 300.00, 2, 0),
    ('Refrigerator',    1, 500.00, 50, 0),
    ('Dryer',           1, 250.00, 100,0),
    ('Coffee Maker',    1, 100.00, 120,0),
    ('Apples',          2, 2.00, 2000,0),
    ('Avocado',         2, 1.50, 1000,0),
    ('Sea Salt',        2, 2.00, 50,0),
    ('Potato Chips',    2, 3.00, 50,0),
    ('Sour Cream',      2, 4.00, 30,0),
    ('Bread Knife',     3, 4.00, 40,0),
    ('Steak Knife',     3, 4.00, 20,0),
    ('Chef Knife',      3, 5.00, 30,0),
    ('French Bread',    4, 4.00, 1000,0),
    ('Croissant',       4, 1.50, 800,0),
    ('Donut',           4, 1.50, 800,0),
    ('Sheet cake',      4, 30, 20,0),
    ('Cupcake',         4, 4.50, 800,0),
    ('Deoderant',       5, 14.50, 10,0),
    ('Tylenol',         5, 14.50, 20,0),
    ('Advil',           5, 14.50, 10,0);
    
		
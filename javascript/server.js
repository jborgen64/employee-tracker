var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "ilbid64=",
  database: "employee_tracker_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
    //initial question

    inquirer.prompt ([
        {
            type: "list",
            message: "What do you want to do?",
            choices: ["View All Employees", "View All Departments", "View All Roles", "Add Employee", "Add Department", "Add Role", "Update Employee Role"],
            name: "firstQuestion"
        }
    ])

    //if/else statements for what to do when answers are chosen
    .then(answers => { 

        //if view all employees is chosen
        if (answers.firstQuestion === "View All Employees") {
            console.log ("view all employees!!!");
        }
        //if view all departments is chosen
        else if (answers.firstQuestion === "View All Departments") {
            console.log ("view all departments here!")
        }
         //if view all roles is chosen
         else if (answers.firstQuestion === "View All Roles") {
            console.log ("view all roles here!")
        }
         //if add employee is chosen
         else if (answers.firstQuestion === "Add Employee") {
            console.log ("add employee here!")
        }
         //if add department is chosen
         else if (answers.firstQuestion === "Add Department") {
            console.log ("add departments here!")
        }
         //if add role is chosen
         else if (answers.firstQuestion === "Add Role") {
            console.log ("Add Role here!")
        }
         //if update employee role is chosen
         else if (answers.firstQuestion === "Update Employee Role") {
            console.log ("update roles here!")
        }
    });
};
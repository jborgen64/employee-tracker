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
            choices: ["View All Employees", "View All Employees by Departments", "View All Employees by Role", "Add Employee", "Add Department", "Add Role", "Update Employee Role"],
            name: "firstQuestion"
        }
    ])

    //if/else statements for what to do when answers are chosen
    .then(answers => { 

        //if view all employees is chosen
        if (answers.firstQuestion === "View All Employees") {
            console.log ("view all employees!!!");
            viewAllEmployees();
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
             createEmployee();
            console.log ("add employee here!")
        }
         //if add department is chosen
         else if (answers.firstQuestion === "Add Department") {
            console.log ("add departments here!")
            createDepartment();
        }
         //if add role is chosen
         else if (answers.firstQuestion === "Add Role") {
            console.log ("Add Role here!")
            createRole();
        }
         //if update employee role is chosen
         else if (answers.firstQuestion === "Update Employee Role") {
            console.log ("update roles here!")
        }
    });
};

//function that will create departments
function createDepartment() {
   
    inquirer
      .prompt([
        {
          name: "department",
          type: "input",
          message: "What is the departments name?"
        },

      ])
      .then(function(answer) {
      
        connection.query(
          "INSERT INTO departments SET ?",
          {
            name: answer.department
          },
          function(err) {
            if (err) throw err;
            console.log("department added!");
       
            start();
          });
      });
  };

  //function that will create roles
  function createRole() {

    connection.query("SELECT * FROM departments", function(err, results) {
        if (err) throw err;
   
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the role's title?"
        },

        {
            name: "salary",
            type: "input",
            message: "What is the role's salary?"
          },

          {
            name: "role_department",
            type: "list",
            message: "Which department is this role in?",
            choices: function() {
                // var choiceArray = [];
                // for (var i = 0; i < results.length; i++) {
                //   choiceArray.push(results[i].name);
                // }
                // return choiceArray;
                var choice = results.map(({ id, name }) => ({
                    value: id, name: `${id} ${name}`
                  }));
                  console.log(choice);
                  return choice;
              },
          }
      ])

      .then(function(answer) {
      
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.role_department
          },
          function(err) {
            if (err) throw err;
          
            console.log("role added!");
       
            start();
          });
      });

    });
  };

    //function that will create employees
    function createEmployee() {

        connection.query("SELECT * FROM role", function(err, results) {
            if (err) throw err;
       
        inquirer
          .prompt([
            {
              name: "firstName",
              type: "input",
              message: "What is this employee's first name?"
            },

            {
                name: "lastName",
                type: "input",
                message: "What is this employee's last name?"
              },
    
            {
                name: "role",
                type: "list",
                message: "What is this employee's role?",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                      choiceArray.push(results[i].title);
                    }
                    return choiceArray;
                  },
              },
    
          ])
    
          .then(function(answer) {
          
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role: answer.role
              },
              function(err) {
                if (err) throw err;
                console.log("employee added!")
                start();
              });
          });
    
        });
      };

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

//function starting question cycle
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
        //if view all employees by departments is chosen
        else if (answers.firstQuestion === "View All Employees by Departments") {
            console.log ("view all employees by departments here!")
            viewByDepartment();
        }
         //if view all employees by roles is chosen
         else if (answers.firstQuestion === "View All Employees by Role") {
            console.log ("view all employees by roles here!")
            viewByRole();
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
            updateEmployeeRole()
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
            name: "department_id",
            type: "list",
            message: "Which department is this role in?",
            choices: function() {
              
                var choice = results.map(({ id, name }) => ({
                    value: id, name: `${name}`
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
            department_id: answer.department_id
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
                name: "role_id",
                type: "list",
                message: "What is this employee's role?",
                choices: function() {
              
                    var choice = results.map(({ id, title }) => ({
                        value: id, name: `${title}`
                      }));
                      console.log(choice);
                      return choice;
                  },
              },
    
          ])
    
          .then(function(answer) {
          
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.role_id
              },
              function(err) {
                if (err) throw err;
                console.log("employee added!")
                start();
              });
          });
    
        });
      };

//function that will display all employees
function viewAllEmployees() {

    var query =  `SELECT employee.id, employee.first_name, employee.last_name, role.title, departments.name AS department, role.salary
                    FROM employee 
                    LEFT JOIN role 
                    ON employee.role_id = role.id
                    LEFT JOIN departments 
                    ON departments.id = role.department_id`

        connection.query(query, function (err, results) {
            if (err) throw err;

            console.table(results);

            start();
        });
};

//function that will display employees by department
function viewByDepartment() {

    connection.query(`SELECT * FROM DEPARTMENTS`, function (err, results) {

        inquirer
        .prompt([
  
          {
              name: "departmentView",
              type: "list",
              message: "Which department do you want to view?",
              choices: function() {
            
                  var choice = results.map(({ id, name }) => ({
                      value: id, name: `${name}`
                    }));
                    console.log(choice);
                    return choice;
                },
            },
        ])


    .then(answers => {
        
        var query =  `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary
                    FROM departments 
                    LEFT JOIN role 
                    ON departments.id = role.department_id
                    LEFT JOIN employee 
                    ON role.id = employee.role_id
                    WHERE departments.id = ?`

        connection.query(query, answers.departmentView, function (err, results) {
            if (err) throw err;

            console.table(results);

           start();
        });

    });

});
};

//function that will display employees by role
function viewByRole() {

    connection.query(`SELECT * FROM ROLE`, function (err, results) {

        inquirer
        .prompt([
  
          {
              name: "roleView",
              type: "list",
              message: "Which role do you want to view?",
              choices: function() {
            
                  var choice = results.map(({ id, title }) => ({
                      value: id, name: `${title}`
                    }));
                    console.log(choice);
                    return choice;
                },
            },
        ])


    .then(answers => {
        console.log(answers)
        var query =  `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary
                    FROM role 
                    LEFT JOIN employee 
                    ON role.id = employee.role_id
                    WHERE role.id = ?`//<= wrong

        connection.query(query, answers.roleView, function (err, results) {
            if (err) throw err;

            console.table(results);

           start();
        });

    });

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

  //function that will update roles of employees

  function updateEmployeeRole() {
    getEmployee()

  function getEmployee() {

    //function to get the choices array for employee
    connection.query("SELECT * FROM employee", function(err, results) {
        if (err) throw err;
              
                var employeeChoice = results.map(({ id, first_name, last_name }) => ({
                    value: id, name: `${first_name} ${last_name}`
                  }));
                  console.log(employeeChoice);
                  getRole(employeeChoice);
              });
            };

    function getRole(employeeChoice) {

    //function getting the roles array for the different roles
    connection.query("SELECT * FROM role", function(err, results) {
        if (err) throw err;
                          
                var roleChoice = results.map(({ id, title }) => ({
                    value: id, name: `${title}`
                }));
                    console.log(roleChoice);
                    updateRole(employeeChoice, roleChoice);
             });
        };

          
        function updateRole(employeeChoice, roleChoice) {

            inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee are you updating?",
          choices: employeeChoice
        },

        {
            name: "role",
            type: "list",
            message: "What is this employees new role?",
            choices: roleChoice
          },

      ])

      .then(answers => {
        console.log(answers.employee)
        console.log(answers.role)

        connection.query(`UPDATE employee SET role_id = ${answers.role} WHERE id = ${answers.employee}`, function(err, results) {
            if (err) throw err;
        
            console.log (results)
            start();
        });


      });
     };

    };
            
      

      
var mysql = require("mysql");
var logo = require("asciiart-logo");
var express = require("express");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
var { response } = require("express");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Ma$terviru6",
    database: "Employees"
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    init();
  });

  // Function to initialize application
  // Display logo text
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);

    function init() {

        // Display main prompts
  inquirer.prompt({
    type: "list",
    name: "start",
    message: "What would you like to do?",
    choices: [
      "View All Employees", 
      "View All Departments", 
      "View All Roles", 
      "View All Employees By Department", 
      "View All Employees By Manager",
      "Add Employee", 
      "Remove Employee", 
      "Update Employee Role", 
      "Add Employee Role", 
      "Remove Role", 
      "Add New Department", 
      "Remove Department"
    ]
  })
  
  // Case depending on user input
  .then((response) => {
    switch (response.start) {
      case "View All Employees":
        viewEmployees();
        break;

      case "View All Departments":
        viewDepartments();
        break;

      case "View All Roles":
        viewRoles();
        break;

      case "View All Employees By Department":
        viewEmployeesByDepartment();
        break;

      case "View All Employees By Manager":
        viewEmployeesByManager();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Remove Employee":
        removeEmployee();
        break;

      case "Update Employee Role":
        updateEmployeeRole();
        break;

      case "Add Employee Role":
        addRole();
        break;

      case "Remove Role":
        removeRole();
        break;

      case "Add New Department":
        addDepartment();
        break;

      case "Remove Department":
        removeDept();
        break;

      case "Update Employee Manager":
        updateEmpManager();
        break;
      }
    })
  };
  
  // Function to view ALL Employees
  function viewEmployees() {
    const employees = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
    CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON  employee.manager_id = manager.id`
    
    connection.query(employees, (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    })
  };

// Function to view ALL Departments
  function viewDepartments() {
    const departments = `SELECT * FROM department`
    connection.query(departments, (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    })
  };

  // Function to view ALL Roles
  function viewRoles() {
    const roles = `SELECT * FROM role`
    connection.query(roles, (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    })
  };
  
    // Function to view Employees by Department
    function viewEmployeesByDepartment() {
        const department = ("SELECT * FROM department");
        
        connection.query(department, (err, response) => {
        if (err) throw err;
        const departments = response.map(element => {
            return { name: `${element.name}` }
        });
        
        inquirer.prompt([{
            type: "list",
            name: "dept",
            message: "Please select a department to view employees",
            choices: departments
        
        }]).then(answer => {
            const department = `SELECT employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name,' ',manager.last_name) AS manager, department.name as department 
            FROM employee LEFT JOIN role on employee.role_id = role.id 
            LEFT JOIN department ON role.department_id =department.id LEFT JOIN employee manager ON employee.manager_id=manager.id
            WHERE ?`
            connection.query(department, [{ name: answer.dept }], function (err, res) {
            if (err) throw err;
            console.table(res)
            init();
            })
        })
        })
    };

    // Function to view Employees by Manager
  function viewEmployeesByManager() {
    let employees = `SELECT * FROM employee e WHERE e.manager_id IS NULL`
    connection.query(employees, (err, res) => {
      if (err) throw err;
      const managers = res.map((element) => {
        return {
          name: `${element.first_name} ${element.last_name}`,
          value: element.id
        }
      });
      inquirer.prompt([{
        type: "list",
        name: "byManager",
        message: "Please select manager to view employees",
        choices: managers
      }])
      .then(response => {
        console.log(response.byManager)
        let manager = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name, ' ', manager.last_name) as manager, department.name AS department FROM employee
        LEFT JOIN role on employee.role_id = role.id
        LEFT JOIN department on department.id = role.department_id
        LEFT JOIN employee manager on employee.manager_id = manager.id
        WHERE employee.manager_id = ?`
        connection.query(manager, [response.byManager], (err, data) => {
          if (err) throw err;
          console.table(data);
          init()
        })
      })
    })
  };

// Function to add a New Employee
function addEmployee() {
    let addNew = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, department.name,
    role.salary, employee.manager_id 
    FROM employee
    INNER JOIN role on role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id`
    connection.query(addNew, (err, results) => {
      if (err) throw err;
      inquirer.prompt([
        {
          type: "input",
          name: "first_name",
          message: "Please enter employee first name"
        }, {
          type: "input",
          name: "last_name",
          message: "Please enter employee last name"
        }, {
          type: "list",
          name: "role",
          message: "Please select employee title",
          choices: results.map(role => {
            return { name: role.title, value: role.role_id }
          })
        }, {
          type: "input",
          name: "manager",
          message: "Please enter employee manager id"
        }])
        .then(answer => {
          console.log(answer);
          connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
            [answer.first_name, answer.last_name, answer.role, answer.manager],
            function (err) {
              if (err) throw err
              console.log(`${answer.first_name} ${answer.last_name} added as a new employee`)
              init();
            })
          })
        })
      };

       // Function to Remove Employee
  function removeEmployee() {
    let terminate = `SELECT * FROM employee`
    connection.query(terminate, (err, res) => {
      if (err) throw err;
      inquirer.prompt([{
        type: "list",
        name: "employeeId",
        message: "Please select employee to remove",
        choices: res.map(employee => {
          return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }
        })
      }])
      .then(answer => {
        let terminate = `DELETE FROM employee WHERE ?`
        connection.query(terminate, [{ id: answer.employeeId }], (err) => {
          if (err) throw err;
          console.log("Employee removed");
          init();
        })
      })
    })
  };
  
  // Function to Remove Role
  function removeRole() {
    let downsize = `SELECT * FROM role`
    connection.query(downsize, (err, res) => {
      if (err) throw err;
      inquirer.prompt([{
        type: "list",
        name: "roleId",
        message: "Please select role to remove",
        choices: res.map(roles => {
          return { name: `${roles.title}`, value: roles.id }
        })
      }])
      .then(answer => {
        let downsize = `DELETE FROM role WHERE ?`
        connection.query(downsize, [{ id: answer.roleId }], (err) => {
          if (err) throw err;
          console.log("Role removed");
          init();
        })
      })
    })
  };
      
// Function to Update Employee Role
function updateEmployeeRole() {
    let update = ("SELECT * FROM employee");
    
    connection.query(update, (err, response) => {
      
      const employees = response.map((element) => {
        return {
          name: `${element.first_name} ${element.last_name}`,
          value: element.id
        }
      });
      inquirer.prompt([{
        type: "list",
        name: "employeeId",
        message: "Which employees role do you want to update",
        choices: employees
      }])
      .then(current => {
        connection.query("SELECT * FROM role", (err, data) => {
          
          const roles = data.map((role) => {
            return {
              name: role.title,
              value: role.id
            }
          });
          
          inquirer.prompt([{
            type: "list",
            name: "roleId",
            message: "What's the new role",
            choices: roles
          }])
          .then(updated => {
            const update = `UPDATE employee
            SET employee.role_id = ? 
            WHERE employee.id = ?`
            connection.query(update, [updated.roleId, current.employeeId], (err, res) => {
              var newPosition;
              
              // will return the updated role
              for (var i = 0; i < roles.length; i++) {
                if (roles[i].value == updated.roleId) {
                  newPosition = roles[i].name;
                }
              }
              // will return the employee
              var employeeName;
              for (var j = 0; j < employees.length; j++) {
                if (employees[j].value == current.employeeId) {
                  employeeName = employees[j].name;
                }
              }
              
              if (res.changedRows === 1) {
                console.log(`Successfully updated ${employeeName} to position of ${newPosition}`);
              } else {
                console.log(`Error: ${employeeName}'s current position is ${newPosition}`)
              }
              init();
            })
          })
        })
      })
    })
  };
  

 // Function for updating an employee's Manager
 async function updateEmployeeManager(){
     const employees = await db.findAllEmployees();
     const chooseEmployee = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    // Chose employee to be updated
    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's manager would you like to update?",
            choices: chooseEmployee
        }
    ]);

    // Select Manager
    const managers = await db.findAllEmployeesByManager(employeeId);
    const chooseManager = managers.map(({ id, first_name, last_name}) =>({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    // Select managerId to be updated
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee would you like to set as manager?",
            choices: chooseManager
        }
    ]);

     // Parse managerId and employeeID to the updateManager
     await db.updateEmployeeManager(employeeId, managerId);
     // Notification that the manager was updated
     console.log("Employee's manager was updated successfully!");
     // function call to display menu again
     loadMainPrompts();
 }
 
// Function to display departments
async function viewDepartments() {
    // call findDepartments function from db
    const departments = await db.findAllDepartments();
    console.log("\n");
    // present data in tabular way
    console.table(departments);
    // function call to display menu again
    loadMainPrompts()
    }
    // Function adds new department to database
    async function addDepartment() {
    // get department from prompt
    const department = await inquirer.prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ]);
    // Parse the department to function
    await db.createDepartment(department);
    // Notification for the new Entry
    console.log(`${department.name} has been added to the database!`);
    // function call to display menu again
    loadMainPrompts();
    }

// Function to delete an existing department
async function removeDepartment() {
    const departments = await db.findAllDepartments();

    // Select department
    const chooseDepartment = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    // Select departemnt to delete
    const { departmentId } = await inquirer.prompt([
    {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to remove, together with existing roles and employees?",
        choices: chooseDepartment
    }
    ]);
    // Parse departmentId to the deleteDepartment function
    await db.removeDepartment(departmentId);
    // Notification that the department was deleted
    console.log("Department has been deleted successfully!");
    // function call to display menu again
    loadMainPrompts();
}
 
// Function to display roles
async function viewRoles() {
    // call the viewRoles from db
    const roles = await db.findAllRoles();
    console.log("\n");
    // Tabulate
    console.table(roles);
    // function to display menu again
    loadMainPrompts();
}

// Function to add a new role in the database
async function addRole() {
    const departments = await db.findAllDepartments();

    // Choose department
    const chooseDepartment = departments.map(({ id, name }) =>({
        name: name,
        value: id
    }));

    // Get role from user
    const newRole = await inquirer.prompt([
        {
            name: "title",
            message: "What is the title of the role?"
        },
        {
            name: "salary",
            message: "What is the role's salary?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department is this role in?",
            choices: chooseDepartment
        }
    ]);

    await db.createRole(newRole);
    // Notification of the new entry
    console.log(`${newRole.title} has been added to the database!`);
    // function call to display menu again
    loadMainPrompts();
}

// Function to delete an existing role from the database
async function removeRole() {
    const roles = await db.findAllRoles();
    // choose role
    const chooseRole = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    // choose role that will be deleted
    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "Which role would you like to remove alongside the employees working in that role?",
            choices: chooseRole
        }
    ]);
    // Parse the role id to the function removeRole
    await db.removeRole(roleId);
    // Notification that the role has been removed
    console.log("Role has been deleted from database successfully!");
    // function call to display menu again
    loadMainPrompts();
}

// Function to exit the program
function quit() {
    const logoTxt = logo({ name: "GoodBye!" }).render();
    console.log(logoTxt);
    process.exit();
}

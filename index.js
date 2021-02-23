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


init();

// Display logo text, load main prompts
function init() {
    const logoText = logo({ name: "Employee Manager" }).render();

    console.log(logoText);

    loadMainPrompts();
}
// Display main prompts
async function loadMainPrompts() {
    const { choice } = await inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "viewAllEmployees"
                },
                {
                    name: "View All Employees By Department",
                    value: "viewAllEmployeesByDepartment"
                },
                {
                    name: "View All Employees By Manager",
                    value: "viewAllEmployeesByManager"
                },
                {
                    name: "Add Employee",
                    value: "addEmployee"
                },
                {
                    name: "Remove Employee",
                    value: "removeEmployee"
                },
                {
                    name: "Update Employee Role",
                    value: "updateEmployeeRole"
                },
                {
                    name: "Update Employee Manager",
                    value: "updateEmployeeManager"
                },
                {
                    name: "View All Roles",
                    value: "viewAllRoles"
                },
                {
                    name: "Add Role",
                    value: "addRole"
                },
                {
                    name: "Remove Role",
                    value: "removeRole"
                },
                {
                    name: "View All Departments",
                    value: "viewAllDepartments"
                },
                {
                    name: "Add Department",
                    value: "addDepartment"
                },
                {
                    name: "Remove Department",
                    value: "removeDepartment"
                },
                {
                    name: "Quit",
                    value: "quit"
                }
            ]
        }
    ]);
    // Case depending on user input
    switch (choice) {
        case "viewAllEmployees":
            return viewEmployees();
        case "viewAllEmployeesByDepartment":
            return viewEmployeesByDepartment();
        case "viewAllEmployeesByManager":
            return viewEmployeesByManager();
        case "addEmployee":
            return addEmployee();
        case "removeEmployee":
            return removeEmployee();
        case "updateEmployeeRole":
            return updateEmployeeRole();
        case "updateEmployeeManager":
            return updateEmployeeManager();
        case "viewAllRoles":
            return viewRoles();
        case "addRole":
            return addRole();
        case "removeRole":
            return removeRole();
        case "viewAllDepartments":
            return viewDepartments();
        case "addDepartment":
            return addDepartment();
        case "removeDepartment":
            return removeDepartment();
        default:
            return quit();
    }
}
// Function to display all employees
async function viewEmployees() {
    // Calling the findAllEmployees function from the db
    const employees = await db.findAllEmployees();
    console.log("\n");
    console.table(employees);
    // Calling the function to display prompts
    loadMainPrompts();
}
// Function to display all employees by department
async function viewEmployeesByDepartment() {
    const departments = await db.findAllDepartments();

    // Select department
    const chooseDepartment = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));
     const { departmentId } = await inquirer.prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department's employees would you like to view? ",
            choices: chooseDepartment
        }
    ]);
     // Calling the findAllEmloyeesByDepartment function from db
     const employees = await db.findAllEmployeesByDepartment(departmentId);
     console.log("\n");
     console.table(employees);
     // Display the prompts 
     loadMainPrompts();
}
// Function to display the employees by manager
async function viewEmployeesByManager() {
    const managers = await db.findAllEmployees();

    // Select manager

    const chooseManager = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    // user prompt choices
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which employee's report would you like to see?",
            choices: chooseManager
        }
    ]);

    // Parse the managerId to the findAllEmployeesByManager function 
    const employees = await db.findAllEmployeesByManager(managerId);
    console.log("\n");

     // Check if the employee has reports
     if (employees.length === 0) {
        console.log("The employee selected has no reports!");
    } else {
        console.table(employees);
    }
    loadMainPrompts();
}

// Function to add a new employee in the database
async function addEmployee() {
    const roles = await db.findAllRoles();
    const employees = await db.findAllEmployees();

    // User input for the new employee's names
    const newEmployee = await inquirer.prompt([
        {
            name: "first_name",
            message: "What is the employee's first name? "
        },
        {
            name: "last_name",
            message: "What is the employee's last name? "
        }
    ]);

    // The role of the new employee
    const chooseRole = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    // Getting the roleId from prompt
    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "What is the new Employee's role?",
            choices: chooseRole
        }
    ]);

    // Assigning the roleId to the employee.role_id
    newEmployee.role_id = roleId;

    // Assigning the manager to the new employee
    const chooseManager = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    chooseManager.unshift({ name: "None", value: null });

    // Getting the manager of the new employee
    const { managerId } = await inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Who is the manager of the new employee? ",
            choices: chooseManager
        }
    ]);

     // Assigning the managerId to the employee
     newEmployee.manager_id = managerId;

      // Calling the createEmployee function
    await db.createEmployee(newEmployee);
    console.log(`${newEmployee.first_name} ${newEmployee.last_name} has been added to the database!`);
    loadMainPrompts();
}

// Function to delete an Employee from the database
async function removeEmployee() {
    const employees = await db.findAllEmployees();
    // Select employee
    const chooseEmployee = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    // Select the employeeId to delete from database
    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to remove?",
            choices: chooseEmployee
        }
    ]);
    // Parsing the employeeId to the removeEmployee function
    await db.removeEmployee(employeeId);

    // Notification that employee was deleted from database
    console.log("Employee removed successfully!");
    // function call to display menu again
    loadMainPrompts();
    }
// Function to update data for the current employee role
async function updateEmployeeRole() {
    const employees = await db.findAllEmployees();
    // Select employee
    const chooseEmployee = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    // Select the employeeId that will have it's role updated
    const { employeeId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's role would you like to update?",
            choices: chooseEmployee
        }
    ]);
     // Find all roles & choose role
     const roles = await db.findAllRoles();
     const chooseRole = roles.map(({ id, title }) => ({
         name: title,
         value: id
     }));
     // choose roleId that the employee will get assigned with
    const { roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "roleId",
            message: "Which role will be assigned to the employee?",
            choices: chooseRole
        }
    ]);
     // Parse roleId and employeeId to updateRole
     await db.updateEmployeeRole(employeeId, roleId);
     // Notification that employee's role was updated
     console.log("Employee's role has been updated successfully!");
 
     // function call to display menu again
     loadMainPrompts();
    }

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

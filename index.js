const connection = require("./connection");

class DB {
    // Keeping a reference to the connection on the class in case we need it later
    constructor(connection) {
        this.connection = connection;
    }

    // Find all employees, join with roles and departments to display their roles, slaries, departments and managers
    findAllEmployees() {
        return this.connection.query(
            "Select employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role"
        )
    }
}
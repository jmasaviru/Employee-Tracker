INSERT INTO department (name)
VALUES
('Marketing'),--1
('Human Resources'),--2
('Engineering'),--3
('Finance');--4

INSERT INTO role (title, salary, department_id)
VALUES 
('Marketing Assistant', 38000, 1),
('Marketing Manager', 60000, 1),
('HR Assistant', 38000, 2),
('HR Manager', 55000, 2),
('Junior Software Engineer', 50000, 3),
('Senior Software Engineer', 80000, 3),
('Accounts Manager', 55000, 4),
('Accounts Assistant', 45000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('James', 'Johnes', 1, 1),
('Harriet', 'Ford', 2, NULL),
('Tom', 'Thumb', 3, 2),
('Brent', 'Hill', 4, NULL),
('Eddie', 'Marten', 5, 3),
('Britney', 'Jordin', 6, NULL),
('Mary', 'Lamb', 7, 7),
('Jane', 'Doe', 8, NULL);
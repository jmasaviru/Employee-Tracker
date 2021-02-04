const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const consoleTable = require("console.table");

init();

// Display logo text, load main prompts
function init() {
    const logoText = logo({ name: "Employee Manager" }).render();

    console.log(logoText);

    loadMainPrompts();
}

async function loadMainPrompts() {
    const { choice } = await prompt([
        {
            type: "list",
            name: "choice",
        }
    ])
}
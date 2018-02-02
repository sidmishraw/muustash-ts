/**
 * index.js
 * @author Sidharth Mishra
 * @description The default yeoman generator. Invoked when using `yo <name>`.
 * @created Wed Jan 31 2018 20:07:13 GMT-0800 (PST)
 * @copyright 2018 Sidharth Mishra
 * @last-modified Fri Feb 02 2018 13:37:28 GMT-0800 (PST)
 */
//==============================================================================================

const Generator = require("yeoman-generator");
const fs = require("fs");
const path = require("path");

/**
 * The project structure:
 * ${project}
 *  |- src
 *  |- build
 *  |- .gitignore
 *  |- LICENSE
 *  |- package.json
 *  |- README.md
 *  |- tsconfig.json
 *  |- tslint.json
 */
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.description = `Generates a TypeScript project ready to be used in VSCode.`;
  }

  /**
   * Prompts the user for getting information.
   * @returns A promise that prompts the user.
   */
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: `project-temp-${new Date().getHours()}-${new Date().getSeconds()}`
      },
      {
        type: "input",
        name: "authorName",
        message: "Author name(Bob Marley <bob@marley.com>)",
        default: "Bob Marley aaur hum na maare?"
      }
    ])
      .then(answers => {
        this.log(`Generating the TS project with name = ${answers.projectName}`);
        this.projectName = answers.projectName; // add the project name
        this.authorName = answers.authorName; // author name
      })
      .catch(err => this.log(`Error:: ${JSON.stringify(err)}`));
  }

  /**
   * The writing phase, muustash starts generating the files.
   */
  writing() {
    this._generateTSProject();
  }

  /**
   * Generates the TypeScript project with the given project name.
   * @param {string} projectName The project name.
   * @param {string} projectPath The path where the TS project will be created.
   */
  _generateTSProject() {
    console.log(`Generating ${this.projectName} at ${this.destinationRoot()} ...`);
    /////// src/main.ts
    this.fs.write(
      this.destinationPath(this.projectName, "src", "main.ts"),
      `
        // The main driver of your TypeScript project
    `
    );
    /////// .vscode/settings.json
    this.fs.copyTpl(
      this.templatePath("vscode", "settings.json"),
      this.destinationPath(this.projectName, ".vscode", "settings.json")
    );
    ////// .gitignore
    this.fs.copyTpl(
      this.templatePath(".gitignore"),
      this.destinationPath(this.projectName, ".gitignore")
    );
    ////// LICENSE
    this.fs.copyTpl(
      this.templatePath("LICENSE"),
      this.destinationPath(this.projectName, "LICENSE")
    );
    ////// package.json
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath(this.projectName, "package.json"),
      {
        projectName: this.projectName,
        authorName: this.authorName
      }
    );
    ////// README.md
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath(this.projectName, "README.md"),
      {
        projectName: this.projectName,
        authorName: this.authorName
      }
    );
    ////// tsconfig.json
    this.fs.copyTpl(
      this.templatePath("tsconfig.json"),
      this.destinationPath(this.projectName, "tsconfig.json")
    );
    ////// tslint.json
    this.fs.copyTpl(
      this.templatePath("tslint.json"),
      this.destinationPath(this.projectName, "tslint.json")
    );
  }

  /**
   * Install phase:
   * Install the dependencies.
   */
  install() {
    process.chdir(this.projectName); // change to the project dir before installing
    this.npmInstall(["@types/node", "tslint-config-prettier"], { "-D": true }).catch(
      err => this.log(`Error:: ${JSON.stringify(err)}`)
    );
  }

  /**
   * Done running Yeoman generator.
   * @returns A promise
   */
  end() {
    this.spawnCommandSync("git", ["init", "--quiet"]);
    this.log(`Done!`);
  }
};

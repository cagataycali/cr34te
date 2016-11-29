var B = require('br4nch');
var E = require('3x3c');
var emoji = require('node-emoji');
var colors = require('colors');
var async = require('async');
var prompt = require('prompt');
var updateNotifier = require('update-notifier');
var pkg = require('./package.json');
var spawn = require( "spawnback" );
var inquirer = require('inquirer');
updateNotifier({pkg}).notify();


module.exports = function C() {
 return new Promise(function(resolve, reject) {
        E(`git config user.name`) // Be sure your git.config.username equal your github username
         .then((username) => {
           var questions = [
             {
               type: 'confirm',
               name: 'isPrivate',
               message: 'private?',
               default: false
             },
              {
                type: 'input',
                name: 'repo',
                message: 'repository name?',
                validate: function (value) {
                  value = value.trim();
                  if (value.length > 0) {
                    return true;
                  }
                  return 'Please enter a name';
                }
              },
              {
                type: 'input',
                name: 'username',
                message: 'github username?',
                default: username.trim(),
                validate: function (value) {
                  value = value.trim();
                  if (value.length > 0) {
                    return true;
                  }
                  return 'Please enter a name';
                }
              }
            ];
            inquirer.prompt(questions).then(function (answers) {

              console.log(colors.green('?'), colors.bold('Write down your github password:'), emoji.emojify(':point_down:'), colors.italic.underline.cyan(' ( It will be hidden )'));
              spawn( "curl", [ "-u", answers.username.trim(), 'https://api.github.com/user/repos', "-d", `{"name":"${answers.repo.trim()}", "private":"${answers.isPrivate}", "description": "${answers.repo.trim()} created automatically."}`], function( error, stdout ) {
                  if (JSON.parse(stdout).clone_url === undefined) {
                    reject(colors.red(`${JSON.parse(stdout).message},\n Please check your github credentials.`));
                  } else {
                    var res = {
                      ssh_url,
                      clone_url,
                      description
                    } = JSON.parse(stdout);
                    resolve(res);
                  }
              });
            });
         })
         .catch((err) => {reject(err)})
  });
}

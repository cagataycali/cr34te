var B = require('br4nch');
var E = require('3x3c');
var emoji = require('node-emoji');
var colors = require('colors');
var async = require('async');
var prompt = require('prompt');
var updateNotifier = require('update-notifier');
var pkg = require('./package.json');
updateNotifier({pkg}).notify();
var inquirer = require('inquirer');
var cmdify = require('cmdify');

function R(cmd, username, repo) {
  return new Promise(function (resolve, reject) {
    var spawn = require('child_process').spawn;
    // var command = spawn(cmd, [repo, username], {
    var command = spawn(cmd, ["-u", `${username.trim()}`, 'https://api.github.com/user/repos', "-d", `{"name":"${repo.trim()}"}`], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
    var result = '';
    command.stdout.on('data', function(data) {
         result += data.toString();
    });
    command.on('close', function(code) {
        resolve(result);
    });
  })
}

module.exports = function C() {
 return new Promise(function(resolve, reject) {
       console.log(colors.green('Be sure about your'));
       console.log(emoji.emojify(' :rotating_light: '), emoji.emojify(colors.green(` Github username already set in your git config: `)), colors.inverse('git config --global github.user <username>'));
       console.log(emoji.emojify(' :rotating_light: '), emoji.emojify(colors.green(` SSH keys registered in github: `)), colors.inverse('https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/'));

       E(`git config user.name`) // Be sure your git.config.username equal your github username
         .then((username) => {
           console.log(`Dedected username: ${username}`);

           prompt.start();
           prompt.get([{name:'repo', req uired: true, description: "Github repo name: Ex. MyAwesomeRepo"}], function (err, result) {

           });


           var questions = [
             {
               type: 'input',
               name: 'url',
               message: 'Which name you want to github repository?'
             }
           ];

           inquirer.prompt(questions).then(function (answers) {
             var loader = [
               '/ Creating github repository.',
               '| Creating github repository..',
               '\\ Creating github repository...',
               '- Creating github repository..'
             ];
             var i = 4;
             var ui = new inquirer.ui.BottomBar({bottomBar: loader[i % 4]});

             setInterval(function () {
               ui.updateBottomBar(loader[i++ % 4]);
             }, 300);

             R(`curl`, username, result.repo)
               .then((value) => {
                 ui.updateBottomBar('Create github repository done!\n');
                 resolve(`https://github.com/${username}/${result.repo}.git`);
               })
               .catch((err) => {ui.updateBottomBar('Create github repository error!\n', err);reject(err)});

         })
         .catch((err) => {reject(err)})
  });
}

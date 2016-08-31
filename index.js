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



           var questions = [
             {
               type: 'input',
               name: 'url',
               message: 'Which name you want to git url?'
             }
           ];

           inquirer.prompt(questions).then(function (answers) {
             var loader = [
               '/ Installing.',
               '| Installing..',
               '\\ Installing...',
               '- Installing..'
             ];
             var i = 4;
             var ui = new inquirer.ui.BottomBar({bottomBar: loader[i % 4]});

             setInterval(function () {
               ui.updateBottomBar(loader[i++ % 4]);
             }, 300);

             E(`git init && git remote add origin ${answers.url} && git remote show origin && git symbolic-ref HEAD && echo "# Hi" >> README.md && git add . && git commit -m "Hi" && git push -u origin master`)
                 .then((value) => {
                   B()
                     .then((out) => {ui.updateBottomBar('Init done!\n');resolve(out)})
                     .catch((err) => {ui.updateBottomBar('Init error!\n', err);reject(err)})
                 })
                 .catch((err) => {ui.updateBottomBar('Init error!\n', err);reject(err)});


           });
         })
         .catch((err) => {reject(err)})
  })
}

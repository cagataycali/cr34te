var B = require('br4nch');
var E = require('3x3c');
var async = require('async');
var updateNotifier = require('update-notifier');
var pkg = require('./package.json');
updateNotifier({pkg}).notify();

function R(cmd, username, repo) {
  return new Promise(function (resolve, reject) {
    var spawn = require('child_process').spawn;
    // var command = spawn(cmd, [repo, username], {
    var command = spawn(cmd, ['https://api.github.com/user/repos',"-u", `${username}`, "-d", `{"name":"${repo}"}`], {
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

function C() {
 return new Promise(function(resolve, reject) {
   var prompt = require('prompt');
       prompt.start();
       prompt.get([{name:'repo', required: true, description: "Github repo name: Ex. MyAwesomeRepo"}], function (err, result) {
         E(`git config user.name`) // Be sure your git.config.username equal your github username
           .then((username) => {
             R(`curl`, username, result.repo)
               .then((value) => {resolve(value);})
               .catch((err) => {reject(err)});
           }).catch((err) => {reject(err)});
       });
     });
  });
}

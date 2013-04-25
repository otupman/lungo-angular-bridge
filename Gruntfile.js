var testacular = require('karma');
var spawn = require('child_process').spawn;

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg:'<json:package.json>',
    meta:{}
  });

  // Default task
  grunt.registerTask('default', 'test');

  grunt.registerTask('server', 'start karma server', function () {
    //Mark the task as async but never call done, so the server stays up
    var done = this.async();
    testacular.server.start({configFile:'config/testacular-e2e.conf.js'});
  });
  
  grunt.registerTask('test', ['karma:config/testacular-unit.conf.js', 'karma:config/testacular-e2e.conf.js']);

  grunt.registerTask('karma', 'run tests', function () {
    if(arguments.length === 0) {
      grunt.fail.fatal('task:karma - no config file specified');
      return;
    }
    var configFile = arguments[0];

    var testCmd = process.platform === 'win32' ? 'karma.cmd' : 'karma';
    var testArgs = ['start', configFile, '--single-run', '--no-auto-watch', '--reporter=dots', '--browsers=Firefox'];
    var specDone = this.async();
    console.log(testCmd);
    console.log(testArgs);
    var child = spawn(testCmd, testArgs);
    
    child.on('close', function(code, signal) {
      if(code === 1) {
        grunt.fail.fatal('Test failed with code ' + code + ' and signal ' + signal);
      }
      else {
        specDone();
      }
    });
    
    child.on('error', function(code, signal) {
        grunt.fail.fatal('Test failed...' + code + ' and signal ' + signal);
    });
                      
                    
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

};
var testacular = require('karma');
var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(grunt) {
  'use strict';
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-todos');

  var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n';

  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
        , banner: banner        
      },
      dist: {
        src: ['src/lungo-angular-bridge.module.js', 'src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: banner
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    watch: {
      files: ['<%= concat.dist.src %>'],
      tasks: ['default']
    }
    , express: {
      server: {
        options: {
          bases: ['', 'docs/www-root']
          , port: 80
          , server: path.resolve('./docs/www-root/server')
          , debug: true
        }
      }
    }
    , todos: {
      options: {
        
      },
      src: ['src/**/*.js', 'test/e2e/**/*.js', 'test/spec/**/*.js', 'test/lab-scenario.js']
    }
  });

  grunt.registerTask('default', ['concat', 'uglify']);
  
  grunt.registerTask('test', ['default', 'test']);

  grunt.registerTask('demoServer', ['default', 'express', 'express-keepalive']);


  // Default task

  grunt.registerTask('server', 'start karma server', function () {
    //Mark the task as async but never call done, so the server stays up
    var done = this.async();
    testacular.server.start({configFile:'config/testacular-e2e.conf.js'});
  });
  
  grunt.registerTask('test', [
    'karma:config/testacular-unit.conf.js', 'karma:config/testacular-e2e.conf.js']
  );

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

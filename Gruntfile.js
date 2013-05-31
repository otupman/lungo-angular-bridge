var testacular = require('karma');
var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(grunt) {
  'use strict';
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  
  
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-todos');

  var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n';

  var packageJsFiles = ['src/lungo-angular-bridge.module.js', 'src/**/*.js'];
  var packageNonJsFiles = ['README.md', 'component.json', 'test/lab-scenario.js', 'LICENCE.txt', 'changelog.md'];
  
  //TODO(otupman) - there's a lot of task duplication here; should move into a custom task
  var packages = {
    stable: {
      dir: 'packages/stable'
      , repo: 'lab-stable-package'
    }
    , unstable: {
      dir: 'packages/unstable'
      , repo: 'lab-unstable'
    }
    , commands: [
      'git add .'
      , 'git commit -m "<%= pkg.name %> - RELEASE v<%= pkg.version %>"'
      , 'git tag <%= pkg.version %>'
      , 'git push --tags'
      , 
    ]
  };
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
        , banner: banner        
      },
      unstable: {
        src: packageJsFiles,
        dest: packages.unstable.dir+'/<%= pkg.name %>.js'
      },
      stable: {
        src: packageJsFiles,
        dest: packages.stable.dir+'/<%= pkg.name %>.js'
      }
      , dist: {
        src: packageJsFiles,
        dest: 'dist/<%= pkg.name %>.js'
      }
    }
    , clean: {
      unstable: [packages.unstable.dir]
      , stable: [packages.stable.dir]
    }
    , shell: {
      options: {
        stdout: true, stderr: true
      }
      // The xxxPre tasks clone out the repo ready to move the updated code in there
      , unstablePre: {
        command: 'git clone https://github.com/centralway/' 
                  + packages.unstable.repo + ' ' + packages.unstable.dir
      }
      , unstable: {
        options: {execOptions: {cwd: packages.unstable.dir}}
        , command: packages.commands.join('&&')
      }
      , stablePre: {
        command: 'git clone https://github.com/centralway/' 
                  + packages.stable.repo + ' ' + packages.stable.dir
      }
      , stable: {
        options: {execOptions: {cwd: packages.stable.dir}}
        , command: packages.commands.join('&&')
      }
    }
    , copy: {
      unstable: {
        files: [{src: packageNonJsFiles, dest: 'packages/unstable/', flatten: true, expand: true}]
      }
    }
    , uglify: {
      options: {
        banner: banner
      },
      unstable: {
        files: {'packages/unstable/<%= pkg.name %>.min.js': ['<%= concat.unstable.dest %>']}
      },
      dist: {
        files: {'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']}
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

  grunt.registerTask('unstable-package', ['clean:unstable', 'shell:unstablePre', 'concat:unstable', 'uglify:unstable', 'copy:unstable', 'shell:unstable']);
  grunt.registerTask('stable-package', ['clean:stable', 'shell:stablePre', 'concat:stable', 'uglify:stable', 'copy:stable', 'shell:stable']);
  
  grunt.registerTask('default', ['concat:dist', 'uglify:dist']);
  
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

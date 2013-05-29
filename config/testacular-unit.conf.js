// Testacular configuration
// Generated on Fri Feb 15 2013 11:42:12 GMT-0500 (EST)


// base path, that will be used to resolve files and exclude
basePath = '../';

preprocessors = {
  '**/src/**/*.js': 'coverage'
};

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'components/angular/angular.js',
  'test/lib/angular-mocks.js',
  'components/quojs/quo.debug.js',
  'lib/lungo.debug.js',
  'test/lib/lungo-mocks.js',
  'src/lungo-angular-bridge.module.js',
  'src/**/*.js',
  'test/spec/**/*.js'
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'coverage'];


// web server port
port = 8080;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Firefox'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

coverageReporter = {
  type : 'lcov',
  dir : 'out/coverage'
};

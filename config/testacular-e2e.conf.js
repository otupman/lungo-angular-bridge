// Testacular configuration
// Generated on Tue Feb 12 2013 13:49:19 GMT-0500 (EST)


// Base path, that will be used to resolve files and exclude
basePath = '../';

urlRoot = '/__testacular/';

// list of files / patterns to load in the browser
files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/lab-scenario.js',
  'test/e2e/**/*.js'
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


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


proxies = {
  '/': 'http://localhost:8000/'
};


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 5000;


// Continuous Integration mode {true: capturebrowsers, false: runtests and exit}
singleRun = false;

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    "phonegap-build": {
      options: {
        archive: "app.zip",
        "appId": "YOU_APP_ID",
        "user": {
          "email": "YOUR_EMAIL",
          "password": "YOUR_PASSWORD"
        }
      }
    },
    zip: {
      app: {
        file: {
          src: ["index.html", "Config.xml", "components/**/*.*", "partials/*.html", "app.js", "controller.js"],
          dest: "app.zip"
        }
     }     
    }
  });

  // Load local tasks.
  grunt.loadNpmTasks('grunt-zipstream');
  grunt.loadNpmTasks('grunt-phonegap-build');

  // Default task.
  grunt.registerTask('default', ['zip', 'phonegap-build']);
};


# PhotoMap
This is a full example of a Lungo-Angular-Bridge + PhoneGap example  
It also demonstrates using native features (Camera and Geolocation in this example).

##Setup dependencies
First of all, you need to install the components into the photomap folder.
Then install the needed grunt tasks to build the app:

    $ cd examples/photomap
    $ npm install
and then you need to adjust the Gruntfile.js:

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
        …
Replace ```YOUR_APP_ID```, ```YOUR_EMAIL``` and ```YOUR_PASSWORD``` with data from your [build.phonegap.com](http://build.phonegap.com) app and account. Then run

##Build

    $ grunt
and you should see

    Running "zip:app" (zip) task
    File app.zip created.
    Total size: 252281 bytes.

    Running "phonegap-build" task
    >> Upload successful

    Done, without errors.
Then you could install the App using build.phonegap.com.
Enjoy your fresh app :o)
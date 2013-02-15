Lungo Angular Bridge
====
Linking Lungo to Angular

## Getting Started

### Installation

The Bridge is a Bower package, so you just need to install Bower - 

    npm install bower -g

Having done that, your next step is

    bower install git@github.com:centralway/lungo-angular-bridge.git

Next, reference the Bridge source file after Lungo & Angular has been referenced:

    <script type="text/javascript" src="../src/lungo-angular-bridge.js"></script>

To get cw-view functionality we'll need to list the Bridge as a dependency:

    angular.module('BridgeExample', ['Centralway.lungo-angular-bridge', 'BridgeExample.filters']).

For the moment, until cw-router is implemented, you need to have one controller call the routing class like so

    function AppCtrl($scope, $location) {
        AppRouter.instance = AppRouter(Lungo, $location, $scope);

If you want to use ng-view, then you'll need to use the Bridge's own implementation instead, cw-view and it must be declared as a child of the body element.

### Usage

Lungo imposes a section/article constraint on URLs. It expects all URLs to be in the following format:

    /[section id](/[article id](/... other params))
    
Some examples:

+ /dashboard => section id='dashboard'
+ /dashboard/some_article => section id='dashboard' - article id='some_article'
+ /dashboard/some_article/confirm => section id='dashboard' - article id='some_article'

## Examples

For the moment, run python -m SimpleHTTPServer from within the root of the repository.

Sooner or later we'll add a node.js server to handle things a litle nicer.

## Tests

In order to run the tests, we are using [Testacular](http://vojtajina.github.com/testacular/). We have two kind of tests, [unit tests](http://docs.angularjs.org/guide/dev_guide.unit-testing) and [end-2-end](http://docs.angularjs.org/guide/dev_guide.e2e-testing) tests.

You need a version of v0.8.4+ and the latest stable version of Testacular (0.5.9).

	npm install -g testacular@0.5.9

### End-2-End Tests

This tests are as effective as browsers we can use in order to ensure the proper DOM manipulation is being performed. To setup proper configuration for this tests, review the `config/testacular-e2e.conf.js` file.

*Start Web Browser*
Start the web browser (a simple wrapper for Python -m SimpleHTTPServer)

	./scripts/web-server.sh

*Start Testacular Server*
It will watch your tests and pop as many browsers as you want to test in order to ensure compatibility. In the future we can put PhantomJS for headless tests for CI

	./scripts/e2e-test.sh

*Sample tests*
E2E Tests are located in `test/e2e`.

## Credits

Copyright (c) 2013 by Centralway Factory AG.

## Licensing Options
Lungo is licensed under free commercial and open source licenses for
application development, and a paid commercial license for OEM uses.

See LICENSE.txt for license.

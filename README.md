Lungo Angular Bridge
====
Linking Lungo to Angular

## Things to know before you start

Lungo and Angular both have some common concepts and therefore have some cross-over in the functionality provided. The bridge views Angular's functionality as being more advanced and so it tends to favour Angular over Lungo. 

#### Open issues

There are lots of issues in our github project, however issue != bug. We like issues, we like to keep track of ideas, things that could be done, questions, etc. So you'll find quite a few issues. If you're interested in contributing, there would be somewhere to look first

#### Routing

Both Angular and Lungo have the concept of 'routing'. In Lungo, 'routing' is used to provide navigation between sections, articles and asides. In Angular, routing is a much more powerful beast, more like rails. 

The Bridge favours Angular's routes; in fact, the majority of the work has been spent on making Angular's routes work well within Lungo. Lungo's "routing" should not be used apart from in **one** case: asides. To show a Lungo aside, one mus use the standard Lungo method:

    <a href='#aside-id' data-router='aside'>Show aside</a>

#### Services

Both Angular and Lungo have the concept of 'services'. We tend to favour Angular services over Lungo services. 

#### Application delivery

Tapquo, Lungo's creators, favour delivering mobile apps as mobile web applications. At Centralway, we love that. But we also love deploying our apps as if they were "native" mobile applications, so we aim to support that too. So if Phonegap is your thing, you'll probably want to look around here.

#### DOM access

Angular relies on a jQuery-like API to modify the browser's DOM. If jQuery is not available, then it uses a built-in jqLite that does something very similar.

Lungo is built upon Quo.js, a mobile-focussed DOM manipulation API (also built by the guys at Tapquo). 

We would try to favour Quo.js to keep things consisent, however we are not consistentin this. We do have an open issue to create a jQuery-like wrapper for Quo.js and make Angular use that - but we're not there yet.

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

### Unit tests

These are to test specific parts of the Bridge outside of the web browser environment. Things that should be tested:

 * directives
 * modules
 * classes
 * controllers (if any!)

The unit test configuration (`config/testacular-unit.conf.js`) includes the following:

1. angular
2. angular mocks
3. quo (debug version)
4. lungo (debug version)

*Running tests*
Your friend is:

    ./scripts/unit-test.sh


## Credits

Copyright (c) 2013 by Centralway Factory AG.

## Licensing Options
Lungo is licensed under free commercial and open source licenses for
application development, and a paid commercial license for OEM uses.

See LICENSE.txt for license.

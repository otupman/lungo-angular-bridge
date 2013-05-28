Lungo Angular Bridge ![](https://travis-ci.org/centralway/lungo-angular-bridge.png) [![Coverage Status](https://coveralls.io/repos/centralway/lungo-angular-bridge/badge.png?branch=development)](https://coveralls.io/r/centralway/lungo-angular-bridge?branch=development)
====
Linking [Lungo](http://lungo.tapquo.com) to [Angular](http://angularjs.org) to bring you mobile awesomeness (if you're worried about the code coverage, we're working on it)

#### What is Lungo?

[Lungo](http://lungo.tapquo.com), created by the geniuses at [Tapquo](http://www.tapquo.com), is an awesome mobile framework that, in the words of one Centralway JS expert, is "better than native" when it comes to building mobile applications.

Here at [Centralway](http://www.centralway.com) we tried many, many different options (Calatrava, Titanium, the m-project, etc.) and only found one - Lungo - that gave the user experience that we feel our users deserve.

#### What is Angular?

Angular provides MVC on steriods. As you're more likely to have heard of Angular, please check out their page - http://angularjs.org for more info!

## Things to know before you start

Lungo and Angular both have some common concepts and therefore have some cross-over in the functionality provided. The bridge views Angular's functionality as being more advanced and so it tends to favour Angular over Lungo.

#### Open issues

There are lots of issues in our github project, however issue != bug. We like issues, we like to keep track of ideas, things that could be done, questions, etc. So you'll find quite a few issues. If you're interested in contributing, there would be somewhere to look first

#### Routing

Both Angular and Lungo have the concept of 'routing'. In Lungo, 'routing' is used to provide navigation between sections, articles and asides. In Angular, routing is a much more powerful beast, more like rails.

The Bridge favours Angular's routes; in fact, the majority of the work has been spent on making Angular's routes work well within Lungo. Lungo's "routing" should not be used.

#### Services

Both Angular and Lungo have the concept of 'services'. We tend to favour Angular services over Lungo services.

#### Application delivery

Tapquo, Lungo's creators, favour delivering mobile apps as mobile web applications. At Centralway, we love that. But we also love deploying our apps as if they were "native" mobile applications, so we aim to support that too. So if Phonegap is your thing, you'll probably want to look around here.

#### DOM access

Angular relies on a jQuery-like API to modify the browser's DOM. If jQuery is not available, then it uses a built-in jqLite that does something very similar.

Lungo is built upon Quo.js, a mobile-focussed DOM manipulation API (also built by the guys at Tapquo).

We would try to favour Quo.js to keep things consisent, however we are not consistentin this. We do have an open issue to create a jQuery-like wrapper for Quo.js and make Angular use that - but we're not there yet.

## Getting Started

### A few Lungo concepts

Before you begin, it's a good idea to familiarise yourself with 3 key Lungo concepts (which are also tags):

1. section
2. article
3. aside

These are best shown in this simple example:

    <body class="app">
        <section id="main" data-transition="">
            <article id="main-article" class="active">
                <strong>This is some text</strong>
                <a ng-click="showAside()">Show aside</a>
            </article>
        </section>
        <aside id="mainAside">
            <strong>This is my aside</strong>
        </aside>
        <!-- Angular, Lungo and Bridge code not shown -->
    </body>

Sections are essentially containers for articles. They can also contain a header and footer tags for, well, headers and footers.

Articles contain content that is to be displayed.

Asides are essentially side-menus that can pop out from the left or the right of the screen.

To play around with Lungo concepts, you can use their excellent [prototyping](http://lungo.tapquo.com/howto/prototype/) documentation to build up some templates. You can, more-or-less, take prototyped Lungo code and build Angular functionality in using the bridge.

### Installation

The Bridge is a Bower package, so you just need to install Bower -

    npm install bower -g

Having done that, your next step is

    bower install git@github.com:centralway/lungo-angular-bridge.git

Next, reference the Bridge source file after Lungo & Angular has been referenced:

    <script type="text/javascript" src="../src/lungo-angular-bridge.js"></script>

To get any of the bridge functionality we'll need to list the Bridge as a dependency:

    angular.module('BridgeExample', ['Centralway.lungo-angular-bridge', 'BridgeExample.filters']).

Then, you'll need to add references to the Bridge directives lab-boot (that initialises the Bridge) and lab-view (that enables the routing behaviour itself and dynamic templates). Like so:

    <body lab-boot>
        <section id="firstSection">
            <article class="active">
                <strong>Currently Lungo needs a first section with an article with a active class applied.</strong>
            </article>
        </section>
        
        <lab-view>

    <body>
        <lab-view></lab-view>

### Usage

Lungo imposes a section/article constraint on URLs. It expects all URLs to be in the following format:

    /[section id](/[article id](/... other params))

Some examples:

+ /dashboard => section id='dashboard'
+ /dashboard/some_article => section id='dashboard' - article id='some_article'
+ /dashboard/some_article/confirm => section id='dashboard' - article id='some_article'

### Asides 

These are small sidebars that appear from either the left or the right; Lungo styles and animates them; do not use Lungo routing to trigger them, instead use the `lab-aside` attribute, for example:

    <a lab-aside="idOfAside">Show aside</a>

LAB will do the work of showing or hiding that for you.

## Examples

For the moment, run python -m SimpleHTTPServer from within the root of the repository.

Sooner or later we'll add a node.js server to handle things a litle nicer.

### Available examples:

You'll find all the following examples within the 'examples' directory (surprise).

#### 'simple' example

This is more of a kitchen sink demo, used also by our test suite. Here we try to demonstrate using the functionality of both Angular & Lungo together at the same time.

#### Todo example

This takes the simple todo example from Angular's front page and puts it into a Lungo application, adding Lungo/mobile features along the way.

#### Photomap examples - Phonegap awesomeness

This example demonstrates accessing aspects of a mobile device to provide a native experience using mapping, geolocation and accessing the device's camera.

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
The Lungo-Angular-Bridge (LAB) is licensed under free commercial and open source licenses for
application development, and a paid commercial license for OEM uses.

See LICENSE.txt for license.

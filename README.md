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

## Credits

Copyright (c) 2013 by Centralway Factory AG.

## Licensing Options
Lungo is licensed under free commercial and open source licenses for
application development, and a paid commercial license for OEM uses.

See LICENSE.txt for license.

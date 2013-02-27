var Lungo = Lungo || {};

Lungo.VERSION = '2.0';

Lungo.Element || (Lungo.Element = {});
Lungo.Data || (Lungo.Data = {});
Lungo.Sugar || (Lungo.Sugar = {});
Lungo.View || (Lungo.View = {});
Lungo.Boot || (Lungo.Boot = {});
Lungo.Device || (Lungo.Device = {});
Lungo.ready || (Lungo.ready = Quo().ready);

/**
 * Object with data-attributes (HTML5) with a special <markup>
 *
 * @namespace Lungo
 * @class Attributes
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Attributes = {
    count: {
        selector: '*',
        html: '<span class="tag theme count">{{value}}</span>'
    },
    pull: {
        selector: 'section',
        html: '<div class="{{value}}" data-control="pull" data-icon="down" data-loading="black">\
                    <strong>title</strong>\
                </div>'
    },
    progress: {
        selector: '*',
        html: '<div class="progress">\
                    <span class="bar"><span class="value" style="width:{{value}};"></span></span>\
                </div>'
    },
    label: {
        selector: '*',
        html: '<abbr>{{value}}</abbr>'
    },
    icon: {
        selector: '*',
        html: '<span class="icon {{value}}"></span>'
    },
    image: {
        selector: '*',
        html: '<img src="{{value}}" class="icon" />'
    },
    title: {
        selector: 'header',
        html: '<span class="title centered">{{value}}</span>'
    },
    loading: {
        selector: '*',
        html: '<div class="loading {{value}}">\
                    <span class="top"></span>\
                    <span class="right"></span>\
                    <span class="bottom"></span>\
                    <span class="left"></span>\
                </div>'
    },
    back: {
        selector: 'header',
        html: '<nav class="left"><a href="#back" data-router="section" class="left"><span class="icon {{value}}"></span></a></nav>'
    }
};

/**
 * Object with data-attributes (HTML5) with a special <markup>
 *
 * @namespace Lungo
 * @class Constants
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Constants = {

    ELEMENT: {
        SECTION: 'section',
        ARTICLE: 'article',
        ASIDE: 'aside',
        BODY: 'body',
        DIV: 'div',
        LIST: '<ul></ul>',
        LI: 'li'
    },

    QUERY: {
        LIST_IN_ELEMENT: 'article.list, aside.list',
        ELEMENT_SCROLLABLE: 'aside.scroll, article.scroll'
    },

    CLASS: {
        ACTIVE: 'active',
        ASIDE: 'aside',
        SHOW: 'show',
        HIDE: 'hide',
        HIDING: 'hiding',
        RIGHT: 'right',
        LEFT: 'left',
        HORIZONTAL: 'horizontal',
        SMALL: 'small'
    },

    TRIGGER: {
        LOAD: 'load',
        UNLOAD: 'unload'
    },

    TRANSITION: {
        DURATION: 350
    },

    ATTRIBUTE: {
        ID: 'id',
        HREF: 'href',
        TITLE: 'title',
        ARTICLE: 'article',
        CLASS: 'class',
        WIDTH: 'width',
        HEIGHT: 'height',
        PIXEL: 'px',
        PERCENT: '%',
        ROUTER: 'router',
        FIRST: 'first',
        LAST: 'last',
        EMPTY: ''
    },

    BINDING: {
        START: '{{',
        END: '}}',
        KEY: 'value',
        SELECTOR: '{{value}}'
    },

    ERROR: {
        DATABASE: 'ERROR: Connecting to Data.Sql.',
        DATABASE_TRANSACTION: 'ERROR: Data.Sql >> ',
        ROUTER: 'ERROR: The target does not exists >>',
        LOADING_RESOURCE: 'ERROR: Loading resource: '
    }

};

/**
 * Contains all the common functions used in Lungo.
 *
 * @namespace Lungo
 * @class Core
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Core = (function(lng, $$, undefined) {

    var ARRAY_PROTO = Array.prototype;
    var HASHTAG_CHARACTER = '#';

    /**
     * Console system to display messages when you are in debug mode.
     *
     * @method log
     *
     * @param {number} Severity based in (1)Log, (2)Warn, (>2)Error
     * @param {string} Message to show in console
     */
    var log = function(severity, message) {
        if (!lng.Core.isMobile()) {
            console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
        } else {
            // @todo : send to the server
        }
    };

    /**
     * Executes callbacks based on the parameters received.
     *
     * @method execute
     *
     * @param {Function} callback to execute
     */
    var execute = function() {
        var args = toArray(arguments);
        var callback = args.shift();

        if (toType(callback) === 'function') {
            callback.apply(null, args);
        }
    };

    /**
     * Creates a new function that, when called, itself calls this function in
     * the context of the provided this value, with a given sequence of arguments
     * preceding any provided when the new function was called.
     *
     * @method bind
     *
     * @param {object} object to which the 'this' can refer in the new function when the new function is called.
     * @param {Function} method A function object.
     */
    var bind = function(object, method) {
        return function() {
            return method.apply(object, toArray(arguments));
        };
    };

    /**
     * Copy from any number of objects and mix them all into a new object.
     * The implementation is simple; just loop through arguments and
     * copy every property of every object passed to the function.
     *
     * @method mix
     *
     * @param {object} arguments to mix them all into a new object.
     * @return {object} child a new object with all the objects from the arguments mixed.
     */
     var mix = function() {
        var child = child || {};
        for (var arg = 0, len = arguments.length; arg < len; arg++) {
            var argument = arguments[arg];
            for (var prop in argument) {
                if (isOwnProperty(argument, prop)) {
                    child[prop] = argument[prop];
                }
            }
        }
        return child;
    };

    /**
     * Every object descended from Object inherits the hasOwnProperty method.
     * This method can be used to determine whether an object has the specified property
     * as a direct property of that object.
     *
     * @param {object} object to test for a property's existence inside itself.
     * @param {string} property the name of the property to test.
     * @return {boolean} indicating whether the object has the specified property.
     */
    var isOwnProperty = function(object, property) {
        return $$.isOwnProperty(object, property);
    };

    /**
     * Determine the internal JavaScript [[Class]] of an object.
     *
     * @param {object} obj to get the real type of itself.
     * @return {string} with the internal JavaScript [[Class]] of itself.
     */
    var toType = function(obj) {
        return $$.toType(obj);
    };

    /**
     * Convert an array-like object into a true JavaScript array.
     *
     * @param {object} obj Any object to turn into a native Array.
     * @return {object} The object is now a plain array.
     */
    var toArray = function(obj) {
        return ARRAY_PROTO.slice.call(obj, 0);
    };

    /**
     * Determine if the current environment is a mobile environment
     *
     * @method isMobile
     *
     * @return {boolean} true if is mobile environment, false if not.
     */
    var isMobile = function() {
        return $$.isMobile();
    };

    /**
     * Returns information of execute environment
     *
     * @method environment
     *
     * @return {object} Environment information
     */
    var environment = function() {
        return $$.environment();
    };

    /**
     * Returns a ordered list of objects by a property
     *
     * @method orderByProperty
     *
     * @param {list} List of objects
     * @param {string} Name of property
     * @param {string} Type of order: asc (ascendent) or desc (descendent)
     * @return {list} Ordered list
     */
    var orderByProperty = function(data, property, order) {
        var order_operator = (order === 'desc') ? -1 : 1;

        return data.sort(function(a, b) {
            return (a[property] < b[property]) ? - order_operator :
                (a[property] > b[property]) ? order_operator : 0;
            }
        );
    };

    /**
     * Returns a correct URL using hashtag character
     *
     * @method parseUrl
     *
     * @param {string} Url
     * @return {string} Url parsed
     */
    var parseUrl = function(href) {
        var href_hashtag = href.lastIndexOf(HASHTAG_CHARACTER);
        if (href_hashtag > 0) {
            href = href.substring(href_hashtag);
        } else if (href_hashtag === -1) {
            href = HASHTAG_CHARACTER + href ;
        }
        return href;
    };

    /**
     * Returns a Object in a list by a property value
     *
     * @method objectInListByProperty
     *
     * @param {list} List of objects
     * @param {string} Name of property
     * @param {var} Value for comparision
     * @return {object} Instance of object founded (if exists)
     */
     var findByProperty = function(list, property, value) {
        var search = null;

        for (var i = 0, len = list.length; i < len; i++) {
            var element = list[i];

            if (element[property] == value) {
                search = element;
                break;
            }
        }

        return search;
    };

    return {
        log: log,
        execute: execute,
        bind: bind,
        mix: mix,
        isOwnProperty: isOwnProperty,
        toType: toType,
        toArray: toArray,
        isMobile: isMobile,
        environment: environment,
        orderByProperty: orderByProperty,
        parseUrl: parseUrl,
        findByProperty: findByProperty
    };

})(Lungo, Quo);

/**
 * LungoJS Dom Handler
 *
 * @namespace Lungo
 * @class Dom
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

/**
     * Add an event listener
     *
     * @method dom
     *
     * @param  {string} <Markup> element selector
     * @return {Object} QuoJS <element> instance
*/
Lungo.dom = function(selector) {
    return $$(selector);
};

/**
 * ?
 *
 * @namespace Lungo
 * @class Fallback
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Events = (function(lng, undefined) {

    var SPACE_CHAR = ' ';

    var init = function(events) {
        for (event in events) {

            var index_of = event.indexOf(SPACE_CHAR);
            if (index_of > 0) {
                var event_name = event.substring(0, index_of);
                var element = event.substring(index_of + 1);
                lng.dom(element).on(event_name, events[event]);
            }
        }
    };

    return {
        init: init
    };

})(Lungo);

/**
 * ?
 *
 * @namespace Lungo
 * @class Fallback
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Fallback = (function(lng, undefined) {

    var fixPositionInAndroid = function() {
        env = lng.Core.environment();
        if (env.isMobile && env.os.name === 'Android' && env.os.version < "3") {
            lng.dom(document.body).data("position", "absolute");
        } else {
            lng.dom(document.body).data("position", "fixed");
        }
    };

    return {
        fixPositionInAndroid: fixPositionInAndroid
    };

})(Lungo);

/**
 * Instance initializer
 *
 * @namespace Lungo
 * @class Init
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.init = function(config) {
    if (config && config.resources) {
        Lungo.Resource.load(config.resources);
    }

    Lungo.Boot.Events.init();
    Lungo.Boot.Data.init();
    Lungo.Boot.Layout.init();
};

/**
 * Notification system in CSS3
 *
 * @namespace Lungo
 * @class Notification
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Notification = (function(lng, undefined) {

    var _options = [];
    var _el = null;
    var _window = null;

    var DELAY_TIME = 1;
    var ANIMATION_MILISECONDS = 200;
    var ATTRIBUTE = lng.Constants.ATTRIBUTE;
    var BINDING = lng.Constants.BINDING;

    var SELECTOR = {
        BODY: 'body',
        NOTIFICATION: '.notification',
        MODAL: '.notification .window',
        MODAL_HREF: '.notification .window a',
        WINDOW_CLOSABLE: '.notification [data-action=close], .notification > .error, .notification > .success',
        CONFIRM_BUTTONS: '.notification .confirm a.button'
    };

    var STYLE = {
        MODAL: 'modal',
        VISIBLE: 'visible',
        SHOW: 'show',
        WORKING: 'working',
        INPUT: 'input'
    };

    var CALLBACK_HIDE = 'Lungo.Notification.hide()';
    var MARKUP_NOTIFICATION = '<div class="notification"><div class="window"></div></div>';

    /**
     *
     */
    var show = function(title, icon, seconds, callback) {
        var markup;
        if (title !== undefined) {
            markup = _markup(title, null, icon);
        } else {
            var data_loading = lng.Attributes.loading.html;
            markup = data_loading.replace(BINDING.START + BINDING.KEY + BINDING.END, 'icon white');
        }

        _show(markup, 'growl');
        _hide(seconds, callback);
    };

    /**
     *
     */
    var hide = function() {
        _window.removeClass('show');
        setTimeout(function() {
            _el.style('display', 'none').removeClass('html').removeClass('confirm').removeClass('notify').removeClass('growl');
        }, ANIMATION_MILISECONDS - 50);
    };

    /**
     *
     */
    var confirm = function(options) {
        _options = options;

        var markup = _markup(options.title, options.description, options.icon);
        markup += _button_markup(options.accept, 'accept');
        markup += _button_markup(options.cancel, 'cancel');

        _show(markup, 'confirm');
    };

    /**
     *
     */
    var success = function(title, description, icon, seconds, callback) {
        _notify(title, description, icon, 'success', seconds, callback);
    };

    /**
     *
     */
    var error = function(title, description, icon, seconds, callback) {
        _notify(title, description, icon, 'error', seconds, callback);
    };

    /**
     *
     */
    var _notify = function(title, description, icon, stylesheet, seconds, callback) {
        _show(_markup(title, description, icon), stylesheet);
        if (seconds) {
            _hide(seconds, callback);
        }
    };

    /**
     *
     */
    var html = function(markup, button) {
        markup += (button) ? '<a href="#" class="button large anchor" data-action="close">' + button + '</a>' : '';
        _show(markup, 'html');
    };


    var _init = function() {
        lng.dom(SELECTOR.BODY).append(MARKUP_NOTIFICATION);
        _el = lng.dom(SELECTOR.NOTIFICATION);
        _window = _el.children('.window');

        _subscribeEvents();
    };

    var _show = function(html, stylesheet) {
        _el.show();
        _window.removeClass(STYLE.SHOW);
        _window.removeClass('error').removeClass('success').removeClass('html').removeClass('growl');
        _window.addClass(stylesheet);
        _window.html(html);

        setTimeout(function() {
            _window.addClass(STYLE.SHOW);
        }, DELAY_TIME);
    };

    var _hide = function(seconds, callback) {
        if (seconds !== undefined && seconds !== 0) {
            var miliseconds = seconds * 1000;
            setTimeout(function() {
                hide();
                // if (callback) callback.apply(callback);
                if (callback) setTimeout(callback, ANIMATION_MILISECONDS);

            }, miliseconds);
        }
    };

    var _markup = function(title, description, icon) {
        description = !description ? "&nbsp;" : description;
        return '<span class="icon ' + icon + '"></span><strong class="text bold">' + title + '</strong><small>' + description + '</small>';
    };

    var _button_markup = function(options, callback) {
        return '<a href="#" data-callback="' + callback + '" class="button anchor large text thin">' + options.label + '</a>';
    };

    var _subscribeEvents = function() {
        lng.dom(SELECTOR.CONFIRM_BUTTONS).tap(function(event) {
            var button = lng.dom(this);
            var callback = _options[button.data('callback')].callback;
            if (callback) callback.call(callback);
            hide();
        });

        lng.dom(SELECTOR.WINDOW_CLOSABLE).tap( hide );
    };

    _init();

    return {
        show: show,
        hide: hide,
        error: error,
        success: success,
        confirm: confirm,
        html: html
    };

})(Lungo);

/**
 * Load Resources
 *
 * @namespace Lungo
 * @class Resource
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Resource = (function(lng, $$, undefined) {

    var ELEMENT = lng.Constants.ELEMENT;
    var ERROR = lng.Constants.ERROR;

    /**
     * Start loading async sections (local & remote)
     *
     * @method start
     *
     */
    var load = function(resource) {
        if (lng.Core.toType(resource) === 'array') {
            for (var i=0, len=resource.length; i < len; i++) {
                _load(resource[i]);
            }
        } else {
            _load(resource);
        }
    };

    /**
     *
     */
    var _load = function(resource) {
        try {
            var response = _loadSyncResource(resource);
            _pushResourceInBody(response);
        } catch(error) {
            lng.Core.log(3, error.message);
        }
    };

    var _loadSyncResource = function(url) {
        return $$.ajax({
            url: url,
            async: false,
            dataType: 'html',
            error: function() {
                console.error(ERROR.LOADING_RESOURCE + url);
            }
        });
    };

    var _pushResourceInBody = function(section) {
        if (lng.Core.toType(section) === 'string') {
            lng.dom(ELEMENT.BODY).append(section);
        }
    };

    return {
        load: load
    };

})(Lungo, Quo);

/*! Overthrow v.0.1.0. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, undefined ){

    var doc = w.document,
        docElem = doc.documentElement,
        classtext = "scroll-enabled",

        // Touch events are used in the polyfill, and thus are a prerequisite
        canBeFilledWithPoly = "ontouchmove" in doc,

        // The following attempts to determine whether the browser has native overflow support
        // so we can enable it but not polyfill
        overflowProbablyAlreadyWorks =
            // Features-first. iOS5 overflow scrolling property check - no UA needed here. thanks Apple :)
            "WebkitOverflowScrolling" in docElem.style ||
            // Touch events aren't supported and screen width is greater than X
            // ...basically, this is a loose "desktop browser" check.
            // It may wrongly opt-in very large tablets with no touch support.
            ( !canBeFilledWithPoly && w.screen.width > 1200 ) ||
            // Hang on to your hats.
            // Whitelist some popular, overflow-supporting mobile browsers for now and the future
            // These browsers are known to get overlow support right, but give us no way of detecting it.
            (function(){
                var ua = w.navigator.userAgent,
                    // Webkit crosses platforms, and the browsers on our list run at least version 534
                    webkit = ua.match( /AppleWebKit\/([0-9]+)/ ),
                    wkversion = webkit && webkit[1],
                    wkLte534 = webkit && wkversion >= 534;

                return (
                    /* Android 3+ with webkit gte 534
                    ~: Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13 */
                    ua.match( /Android ([0-9]+)/ ) && RegExp.$1 >= 3 && wkLte534 ||
                    /* Blackberry 7+ with webkit gte 534
                    ~: Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0 Mobile Safari/534.11+ */
                    ua.match( / Version\/([0-9]+)/ ) && RegExp.$1 >= 0 && w.blackberry && wkLte534 ||
                    /* Blackberry Playbook with webkit gte 534
                    ~: Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/0.0.1 Safari/534.8+ */
                    ua.indexOf( /PlayBook/ ) > -1 && RegExp.$1 >= 0 && wkLte534 ||
                    /* Firefox Mobile (Fennec) 4 and up
                    ~: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:2.1.1) Gecko/ Firefox/4.0.2pre Fennec/4.0. */
                    ua.match( /Fennec\/([0-9]+)/ ) && RegExp.$1 >= 4 ||
                    /* WebOS 3 and up (TouchPad too)
                    ~: Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.48 Safari/534.6 TouchPad/1.0 */
                    ua.match( /wOSBrowser\/([0-9]+)/ ) && RegExp.$1 >= 233 && wkLte534 ||
                    /* Nokia Browser N8
                    ~: Mozilla/5.0 (Symbian/3; Series60/5.2 NokiaN8-00/012.002; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/533.4 (KHTML, like Gecko) NokiaBrowser/7.3.0 Mobile Safari/533.4 3gpp-gba
                    ~: Note: the N9 doesn't have native overflow with one-finger touch. wtf */
                    ua.match( /NokiaBrowser\/([0-9\.]+)/ ) && parseFloat(RegExp.$1) === 7.3 && webkit && wkversion >= 533
                );
            })(),

        // Easing can use any of Robert Penner's equations (http://www.robertpenner.com/easing_terms_of_use.html). By default, overthrow includes ease-out-cubic
        // arguments: t = current iteration, b = initial value, c = end value, d = total iterations
        // use w.overthrow.easing to provide a custom function externally, or pass an easing function as a callback to the toss method
        defaultEasing = function (t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },

        enabled = false,

        // Keeper of intervals
        timeKeeper,

        /* toss scrolls and element with easing

        // elem is the element to scroll
        // options hash:
            * left is the desired horizontal scroll. Default is "+0". For relative distances, pass a string with "+" or "-" in front.
            * top is the desired vertical scroll. Default is "+0". For relative distances, pass a string with "+" or "-" in front.
            * duration is the number of milliseconds the throw will take. Default is 100.
            * easing is an optional custom easing function. Default is w.overthrow.easing. Must follow the easing function signature
        */
        toss = function( elem, options ){
            var i = 0,
                sLeft = elem.scrollLeft,
                sTop = elem.scrollTop,
                // Toss defaults
                o = {
                    top: "+0",
                    left: "+0",
                    duration: 100,
                    easing: w.overthrow.easing
                },
                endLeft, endTop;

            // Mixin based on predefined defaults
            if( options ){
                for( var j in o ){
                    if( options[ j ] !== undefined ){
                        o[ j ] = options[ j ];
                    }
                }
            }

            // Convert relative values to ints
            // First the left val
            if( typeof o.left === "string" ){
                o.left = parseFloat( o.left );
                endLeft = o.left + sLeft;
            }
            else {
                endLeft = o.left;
                o.left = o.left - sLeft;
            }
            // Then the top val
            if( typeof o.top === "string" ){
                o.top = parseFloat( o.top );
                endTop = o.top + sTop;
            }
            else {
                endTop = o.top;
                o.top = o.top - sTop;
            }

            timeKeeper = setInterval(function(){
                if( i++ < o.duration ){
                    elem.scrollLeft = o.easing( i, sLeft, o.left, o.duration );
                    elem.scrollTop = o.easing( i, sTop, o.top, o.duration );
                }
                else{
                    if( endLeft !== elem.scrollLeft ){
                        elem.scrollLeft = endLeft;
                    }
                    if( endTop !== elem.scrollTop ){
                        elem.scrollTop = endTop;
                    }
                    intercept();
                }
            }, 1 );

            // Return the values, post-mixin, with end values specified
            return { top: endTop, left: endLeft, duration: o.duration, easing: o.easing };
        },

        // find closest overthrow (elem or a parent)
        closest = function( target, ascend ){
            return !ascend && target.className && target.className.indexOf( "scroll" ) > -1 && target || closest( target.parentNode );
        },

        // Intercept any throw in progress
        intercept = function(){
            clearInterval( timeKeeper );
        },

        // Enable and potentially polyfill overflow
        enable = function(){

            // If it's on,
            if( enabled ){
                return;
            }
            // It's on.
            enabled = true;

            // If overflowProbablyAlreadyWorks or at least the element canBeFilledWithPoly, add a class to cue CSS that assumes overflow scrolling will work (setting height on elements and such)
            if( overflowProbablyAlreadyWorks || canBeFilledWithPoly ){
                docElem.className += " " + classtext;
            }

            // Destroy everything later. If you want to.
            w.overthrow.forget = function(){
                // Strip the class name from docElem
                docElem.className = docElem.className.replace( classtext, "" );
                // Remove touch binding (check for method support since this part isn't qualified by touch support like the rest)
                if( doc.removeEventListener ){
                    doc.removeEventListener( "touchstart", start, false );
                }
                // reset easing to default
                w.overthrow.easing = defaultEasing;

                // Let 'em know
                enabled = false;
            };

            // If overflowProbablyAlreadyWorks or it doesn't look like the browser canBeFilledWithPoly, our job is done here. Exit viewport left.
            if( overflowProbablyAlreadyWorks || !canBeFilledWithPoly ){
                return;
            }

            // Fill 'er up!
            // From here down, all logic is associated with touch scroll handling
                // elem references the overthrow element in use
            var elem,

                // The last several Y values are kept here
                lastTops = [],

                // The last several X values are kept here
                lastLefts = [],

                // lastDown will be true if the last scroll direction was down, false if it was up
                lastDown,

                // lastRight will be true if the last scroll direction was right, false if it was left
                lastRight,

                // For a new gesture, or change in direction, reset the values from last scroll
                resetVertTracking = function(){
                    lastTops = [];
                    lastDown = null;
                },

                resetHorTracking = function(){
                    lastLefts = [];
                    lastRight = null;
                },

                // After releasing touchend, throw the overthrow element, depending on momentum
                finishScroll = function(){
                    // Come up with a distance and duration based on how
                    // Multipliers are tweaked to a comfortable balance across platforms
                    var top = ( lastTops[ 0 ] - lastTops[ lastTops.length -1 ] ) * 8,
                        left = ( lastLefts[ 0 ] - lastLefts[ lastLefts.length -1 ] ) * 8,
                        duration = Math.max( Math.abs( left ), Math.abs( top ) ) / 8;

                    // Make top and left relative-style strings (positive vals need "+" prefix)
                    top = ( top > 0 ? "+" : "" ) + top;
                    left = ( left > 0 ? "+" : "" ) + left;

                    // Make sure there's a significant amount of throw involved, otherwise, just stay still
                    if( !isNaN( duration ) && duration > 0 && ( Math.abs( left ) > 80 || Math.abs( top ) > 80 ) ){
                        toss( elem, { left: left, top: top, duration: duration } );
                    }
                },

                // On webkit, touch events hardly trickle through textareas and inputs
                // Disabling CSS pointer events makes sure they do, but it also makes the controls innaccessible
                // Toggling pointer events at the right moments seems to do the trick
                // Thanks Thomas Bachem http://stackoverflow.com/a/5798681 for the following
                inputs,
                setPointers = function( val ){
                    inputs = elem.querySelectorAll( "textarea, input" );
                    for( var i = 0, il = inputs.length; i < il; i++ ) {
                        inputs[ i ].style.pointerEvents = val;
                    }
                },

                // For nested overthrows, changeScrollTarget restarts a touch event cycle on a parent or child overthrow
                changeScrollTarget = function( startEvent, ascend ){
                    if( doc.createEvent ){
                        var newTarget = ( !ascend || ascend === undefined ) && elem.parentNode || elem.touchchild || elem,
                            tEnd;

                        if( newTarget !== elem ){
                            tEnd = doc.createEvent( "HTMLEvents" );
                            tEnd.initEvent( "touchend", true, true );
                            elem.dispatchEvent( tEnd );
                            newTarget.touchchild = elem;
                            elem = newTarget;
                            newTarget.dispatchEvent( startEvent );
                        }
                    }
                },

                // Touchstart handler
                // On touchstart, touchmove and touchend are freshly bound, and all three share a bunch of vars set by touchstart
                // Touchend unbinds them again, until next time
                start = function( e ){

                    // Stop any throw in progress
                    intercept();

                    // Reset the distance and direction tracking
                    resetVertTracking();
                    resetHorTracking();

                    elem = closest( e.target );

                    if( !elem || elem === docElem || e.touches.length > 1 ){
                        return;
                    }

                    setPointers( "none" );
                    var touchStartE = e,
                        scrollT = elem.scrollTop,
                        scrollL = elem.scrollLeft,
                        height = elem.offsetHeight,
                        width = elem.offsetWidth,
                        startY = e.touches[ 0 ].pageY,
                        startX = e.touches[ 0 ].pageX,
                        scrollHeight = elem.scrollHeight,
                        scrollWidth = elem.scrollWidth,

                        // Touchmove handler
                        move = function( e ){

                            var ty = scrollT + startY - e.touches[ 0 ].pageY,
                                tx = scrollL + startX - e.touches[ 0 ].pageX,
                                down = ty >= ( lastTops.length ? lastTops[ 0 ] : 0 ),
                                right = tx >= ( lastLefts.length ? lastLefts[ 0 ] : 0 );

                            // If there's room to scroll the current container, prevent the default window scroll
                            if( ( ty > 0 && ty < scrollHeight - height ) || ( tx > 0 && tx < scrollWidth - width ) ){
                                e.preventDefault();
                            }
                            // This bubbling is dumb. Needs a rethink.
                            else {
                                changeScrollTarget( touchStartE );
                            }

                            // If down and lastDown are inequal, the y scroll has changed direction. Reset tracking.
                            if( lastDown && down !== lastDown ){
                                resetVertTracking();
                            }

                            // If right and lastRight are inequal, the x scroll has changed direction. Reset tracking.
                            if( lastRight && right !== lastRight ){
                                resetHorTracking();
                            }

                            // remember the last direction in which we were headed
                            lastDown = down;
                            lastRight = right;

                            // set the container's scroll
                            elem.scrollTop = ty;
                            elem.scrollLeft = tx;

                            lastTops.unshift( ty );
                            lastLefts.unshift( tx );

                            if( lastTops.length > 3 ){
                                lastTops.pop();
                            }
                            if( lastLefts.length > 3 ){
                                lastLefts.pop();
                            }
                        },

                        // Touchend handler
                        end = function( e ){
                            // Apply momentum based easing for a graceful finish
                            finishScroll();
                            // Bring the pointers back
                            setPointers( "auto" );
                            setTimeout( function(){
                                setPointers( "none" );
                            }, 450 );
                            elem.removeEventListener( "touchmove", move, false );
                            elem.removeEventListener( "touchend", end, false );
                        };

                    elem.addEventListener( "touchmove", move, false );
                    elem.addEventListener( "touchend", end, false );
                };

            // Bind to touch, handle move and end within
            doc.addEventListener( "touchstart", start, false );
        };

    // Expose overthrow API
    w.overthrow = {
        set: enable,
        forget: function(){},
        easing: defaultEasing,
        toss: toss,
        intercept: intercept,
        closest: closest,
        support: overflowProbablyAlreadyWorks ? "native" : canBeFilledWithPoly && "polyfilled" || "none"
    };

    // Auto-init
    enable();

})( this );

/**
 * External Data & Services Manager
 *
 * @namespace Lungo
 * @class Service
 * @requires QuoJS
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Service = (function(lng, $$, undefined) {

    var URL_CACHE_INDEX_KEY = 'lungojs_service_cache';
    var DATE_PATTERN = {
        MINUTE: 'minute',
        HOUR: 'hour',
        DAY: 'day'
    };

    /**
     * Load data from the server using a HTTP GET request.
     *
     * @method get
     *
     * @param  {string} Containing the URL to which the request is sent
     * @param  {object} A map or string that is sent to the server with the request
     * @param  {Function} Callback function after the request [OPTIONAL]
     * @param  {string} Mime-Type: json, xml, html, or text [OPTIONAL]
     */
    var get = function(url, data, success, dataType) {
        return $$.get(url, data, success, dataType);
    };

    /**
     * Load data from the server using a HTTP POST request.
     *
     * @method post
     *
     * @param  {string} Containing the URL to which the request is sent
     * @param  {object} A map or string that is sent to the server with the request
     * @param  {Function} Callback function after the request [OPTIONAL]
     * @param  {string} Mime-Type: json, xml, html, or text [OPTIONAL]
     */
    var post = function(url, data, success, dataType) {
        return $$.post(url, data, success, dataType);
    };

    /**
     * Load data from the server using a HTTP GET request.
     *
     * @method json
     *
     * @param  {string} Containing the URL to which the request is sent
     * @param  {object} A map or string that is sent to the server with the request
     * @param  {Function} [OPTIONAL] Callback function after the request
     */
    var json = function(url, data, success) {
        return $$.json(url, data, success);
    };

    /**
     * Auto-caching system with date pattern.
     *
     * @method cache
     *
     * @param  {string} Containing the URL to which the request is sent
     * @param  {object} A map or string that is sent to the server with the request
     * @param  {string} Date pattern (example: 15 minutes, 1 hour, 3 days)
     * @param  {Function} [OPTIONAL] Callback function after the request
     * @param  {string} Mime-Type: json, xml, html, or text [OPTIONAL]
     */
    var cache = function(url, data, date_pattern, callback, dataType) {
        var url_key = url + $$.serializeParameters(data);

        if (_urlCached(url_key, date_pattern)) {
            var value = lng.Data.Storage.persistent(url_key);
            if (value) {
                return callback.call(callback, value);
            }
        } else {
            return $$.get(url, data, function(result) {
                _saveServiceInCache(url_key, result);
                callback.call(callback, result);
            }, dataType);
        }
    };

    var _urlCached = function(url, date_pattern) {
        var in_cache = false;

        var url_cache_index = lng.Data.Storage.persistent(URL_CACHE_INDEX_KEY);
        if (url_cache_index) {
            var time_between = _calculateTimeSpent(url_cache_index[url]);
            in_cache = _checkIsValidPattern(time_between, date_pattern);
        }

        return in_cache;
    };

    var _calculateTimeSpent = function(url_last_access) {
        var now = new Date().getTime();
        var service_last_access = new Date(url_last_access).getTime();

        return now - service_last_access;
    };

    var _checkIsValidPattern = function(time_between, date_pattern) {
        var pattern = date_pattern.split(' ');
        var diference_time = _calculateDiferenceTime(pattern[1], time_between);

        return (diference_time < pattern[0]) ? true : false;
    };

    var _calculateDiferenceTime = function(pattern_name, time_between) {
        var diference = (time_between / 1000) / 60;

        if (pattern_name.indexOf(DATE_PATTERN.HOUR) >= 0) {
            diference = diference / 60;
        } else if (pattern_name.indexOf(DATE_PATTERN.DAY) >= 0) {
            diference = (diference / 60) / 24;
        }

        return diference;
    };

    var _saveServiceInCache = function(url, result) {
        var service_cache_index = lng.Data.Storage.persistent(URL_CACHE_INDEX_KEY) || {};
        service_cache_index[url] = new Date();

        lng.Data.Storage.persistent(URL_CACHE_INDEX_KEY, service_cache_index);
        lng.Data.Storage.persistent(url, result);
    };

    return {
        get: get,
        post: post,
        json: json,
        cache: cache,
        Settings: $$.ajaxSettings
    };

})(Lungo, Quo);

/**
 * Make an analysis of Data attributes in HTML elements and creates a <markup>
 * based on each data type.
 *
 * @namespace Lungo.Boot
 * @class Data
 *
 * @author Javier Jimenez Villar <javi@tapquo.com>  || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com>     || @pasku1
 * @author Ignacio Olalde <ina@tapquo.com>          || @piniphone
 */

Lungo.Boot.Data = (function(lng, undefined) {
    var BINDING = lng.Constants.BINDING;

    /**
     * Initialize the <markup> data-attributes analisys
     *
     * @method init
     *
     *
     */
    var init = function(selector) {
        var el = lng.dom(selector || document.body);
        if (el.length > 0) _findDataAttributesIn(el);
    };

    var _findDataAttributesIn = function(element) {
        for (var key in lng.Attributes) {
            if (lng.Core.isOwnProperty(lng.Attributes, key)) {
                _findElements(element, key);
            }
        }
    };

    var _findElements = function(element, key) {
        attribute = lng.Attributes[key];
        var selector = attribute.selector + "[data-" + key + "]";
        element.find(selector).each(function(index, children) {
            var el = lng.dom(children);
            _bindDataAttribute(el, el.data(key), attribute.html);
        });
    };

    var _bindDataAttribute = function(element, value, html) {
        var html_binded = html.replace(BINDING.START + BINDING.KEY + BINDING.END, value);
        element.prepend(html_binded);
    };

    return {
        init: init
    };

})(Lungo);

/**
 * Initialize the automatic DOM UI events
 *
 * @namespace Lungo.Boot
 * @class Events
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Boot.Events = (function(lng, undefined) {

    var ATTRIBUTE = lng.Constants.ATTRIBUTE;
    var CLASS = lng.Constants.CLASS;
    var ELEMENT = lng.Constants.ELEMENT;
    var SELECTORS = {
        HREF_ASIDE: 'header a[href][data-router=aside]',
        HREF_TARGET: 'a[href][data-router]',
        HREF_TARGET_FROM_ASIDE: 'aside a[href][data-router]',
        INPUT_CHECKBOX: 'input[type=range].checkbox'
    };

    /**
     * Initializes the automatic subscription events by markup of the project.
     *
     * @method init
     *
     */
    var init = function() {
        lng.dom(SELECTORS.HREF_TARGET_FROM_ASIDE).tap(_hideAsideIfNecesary);
        lng.dom(SELECTORS.HREF_TARGET).tap(_loadTarget);
        lng.dom(SELECTORS.INPUT_CHECKBOX).tap(_changeCheckboxValue);
        lng.View.Aside.suscribeEvents(lng.dom(SELECTORS.HREF_ASIDE));
    };

    var _loadTarget = function(event) {
        event.preventDefault();
        var link = lng.dom(this);

        if (link.data("async")) {
            _loadAsyncTarget(link);
        } else {
            _selectTarget(link);
        }
    };

    var _hideAsideIfNecesary = function(event) {
        event.preventDefault();
        lng.View.Aside.hide();
    };

    var _changeCheckboxValue = function(event)  {
        event.preventDefault();
        var el = lng.dom(this);
        var current_value = el.val() > 0 ? 0 : 1;
        el.toggleClass("active").attr('value', current_value);
    };

    var _selectTarget = function(link) {
        var target_type = link.data(ATTRIBUTE.ROUTER);
        switch(target_type) {
            case ELEMENT.SECTION:
                var target_id = link.attr(ATTRIBUTE.HREF);
                _goSection(target_id);
                break;

            case ELEMENT.ARTICLE:
                _goArticle(link);
                break;

            case ELEMENT.ASIDE:
                _goAside(link);
                break;
        }
    };

    var _loadAsyncTarget = function(link) {
        lng.Notification.show();
        lng.Resource.load(link.data("async"));
        link[0].removeAttribute("data-async");
        lng.Boot.Data.init( link.attr(ATTRIBUTE.HREF) );

        setTimeout(function() {
            _selectTarget(link);
            lng.Notification.hide();
        }, lng.Constants.TRANSITION.DURATION * 2);
    };

    var _goSection = function(id) {
        id = lng.Core.parseUrl(id);
        if (id === '#back') {
            lng.Router.back();
        } else {
            lng.Router.section(id);
        }
    };

    var _goArticle = function(element) {
        var section_id = lng.Router.History.current();
        var article_id =  element.attr(ATTRIBUTE.HREF);

        lng.Router.article(section_id, article_id, element);
    };

    var _goAside = function(element) {
        var section_id = lng.Router.History.current();
        var aside_id = element.attr(ATTRIBUTE.HREF);

        lng.Router.aside(section_id, aside_id);
    };

    return {
        init: init
    };

})(Lungo);

/**
 * Initialize the Layout of LungoJS (if it's a mobile environment)
 *
 * @namespace Lungo.Boot
 * @class Layout
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Boot.Layout = (function(lng, undefined) {

    var ELEMENT = lng.Constants.ELEMENT;
    var CLASS = lng.Constants.CLASS;
    var ATTRIBUTE = lng.Constants.ATTRIBUTE;
    var QUERY = lng.Constants.QUERY;

    /**
     * Initializes all <section> & <article> of the project
     *
     * @method init
     *
     */
    var init = function() {
        lng.Fallback.fixPositionInAndroid();

        _initFirstSection();
        _initElement(QUERY.LIST_IN_ELEMENT, _createListElement);
        _initElement(QUERY.ELEMENT_SCROLLABLE, _scrollFix);
    };

    var _initFirstSection = function() {
        var section = lng.dom(ELEMENT.SECTION).first().addClass(CLASS.SHOW);
        lng.Element.Cache.section = section;
        lng.Element.Cache.article = section.children(ELEMENT.ARTICLE + "." + CLASS.ACTIVE);

        lng.View.Article.switchReferenceItems(lng.Element.Cache.article.attr("id"), section);

        var section_id = '#' + section.attr(ATTRIBUTE.ID);
        lng.Router.History.add(section_id);
    };

    var _initElement = function(selector, callback) {
        var found_elements = lng.dom(selector);
        for (var i = 0, len = found_elements.length; i < len; i++) {
            var element = lng.dom(found_elements[i]);
            lng.Core.execute(callback, element);
        }
    };

    var _createListElement = function(element) {
        if (element.children().length === 0) {
            var element_id = element.attr(ATTRIBUTE.ID);
            element.append(ELEMENT.LIST);
        }
    };

    var _scrollFix = function(element) {
        element[0].addEventListener('touchstart', function(event) {
            scrollTop = this.scrollTop;
            if(scrollTop <= 1) {
                this.scrollTop = 1;
            }
            if(scrollTop + this.offsetHeight >= this.scrollHeight) {
                this.scrollTop = this.scrollHeight - this.offsetHeight - 1;
            }
        }, false);
    };

    return {
        init: init
    };

})(Lungo);

/**
 * Temporary cache system
 *
 * @namespace Lungo.Data
 * @class Cache
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Data.Cache = (function(lng, undefined) {

    var _cache = {};

    /**
     * Sets in the LungoJS cache system a new key/value
     *
     * @method set
     *
     * @param {string} Key for the new value
     * @param {object} Type of environment: DESKTOP_ENVIRONMENT or MOBILE_ENVIRONMENT
     */
    var set = function(key, value) {
        if (exists(key)) {
            _cache[key] = lng.Core.mix(get(key), value);
        } else {
            _cache[key] = value;
        }
    };

    /**
     * Returns the value of a given key.
     *
     * @method get
     *
     * @param {string} Key in LungoJS Cache System
     * @param {string} [OPTIONAL] Subkey in LungoJS Cache System
     * @return {object} Value
     */
    var get = function(key, value) {
        if (arguments.length === 1) {
            return _cache[key];
        } else {
            return (_cache[arguments[0]]) ? _cache[arguments[0]][arguments[1]] : undefined;
        }
    };

    /**
     * Removes the instance in LungoJs Cache System of a given key
     *
     * @method remove
     *
     * @param {string} Key in LungoJS Cache System
     * @param {string} [OPTIONAL] Subkey in LungoJS Cache System
     */
    var remove = function(key, value) {
        if (arguments.length === 1) {
            delete _cache[key];
        } else {
            delete _cache[arguments[0]][arguments[1]];
        }
    };

    /**
     * Returns the existence of a key in LungoJs Cache System
     *
     * @method exists
     *
     * @param {String} Key in LungoJS Cache System
     * @return {Boolean} true if exists, false if not
     */
    var exists = function(key) {
        return (_cache[key]) ? true : false;
    };

    return {
        set: set,
        get: get,
        remove: remove,
        exists: exists
    };

})(Lungo);

/**
 * Wrapper for using WebSql (HTML5 feature)
 *
 * @namespace Lungo.Data
 * @class Sql
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Data.Sql = (function(lng, undefined) {

    var ERROR = lng.Constants.ERROR;
    var CONFIG = {
        name: 'lungo_db',
        version: '1.0',
        size: 65536,
        schema: []
    };

    var db = null;

    /**
     * Initialize the SQLite storage (HTML5 Feature)
     *
     * @method init
     *
     * @param {object} Configuration for the Database
     */
    var init = function(db_config) {
        CONFIG = lng.Core.mix(CONFIG, db_config);

        db = openDatabase(CONFIG.name, CONFIG.version, CONFIG.name, CONFIG.size);
        if (db) {
            _createSchema();
        } else {
            throw new Error(ERROR.DATABASE);
        }
    };

    /**
     * Select a data set of a given table and based on a selection object
     *
     * @method select
     *
     * @param {string} Name of the table in the database
     * @param {object} [OPTIONAL] Object selection condition
     * @param {Function} Callback when the process is complete
     */
    var select = function(table, where_obj, callback) {
        var where = (where_obj) ? ' WHERE ' + _convertToSql(where_obj, 'AND') : '';

        execute('SELECT * FROM ' + table + where, function(rs) {
            var result = [];
            for (var i = 0, len = rs.rows.length; i < len; i++) {
                result.push(rs.rows.item(i));
            }

            _callbackResponse(callback, result);
        });
    };

    /**
     * Inserts a data set of a given table and based on a data object
     *
     * @method insert
     *
     * @param {string} Name of the table in the database
     * @param {object} Object (or Array of objects) to insert in table
     */
    var insert = function(table, data, callback) {
        if (lng.Core.toType(data) === 'object') {
            _insertRow(table, data);
        } else {
            for (row in data) {
                _insertRow(table, data[row]);
            }
        }
    };

    /**
     * Updates a data set of a given table and based on a data object and
     * an optional selection object
     *
     * @method update
     *
     * @param {string} Name of the table in the database
     * @param {object} Data object to update in table
     * @param {object} [OPTIONAL] Object selection condition
     */
    var update = function(table, data_obj, where_obj, callback) {
        var sql = 'UPDATE ' + table + ' SET ' + _convertToSql(data_obj, ',');
        if (where_obj) sql += ' WHERE ' + _convertToSql(where_obj, 'AND');

        execute(sql);
    };

    /**
     * Delete a data set of a given table and based on a selection object
     *
     * @method drop
     *
     * @param {string} Name of the table in the database
     * @param {object} [OPTIONAL] Object selection condition
     */
    var drop = function(table, where_obj, callback) {
        var where = (where_obj) ? ' WHERE ' + _convertToSql(where_obj, 'AND') : '';

        execute('DELETE FROM ' + table + where + ';');
    };

    /**
     * Executes a SQL statement in the SQLite storage
     *
     * @method execute
     *
     * @param {string} SQL statement
     * @param {Function} Callback when the process is complete
     */
    var execute = function(sql, callback) {
        lng.Core.log(1, 'lng.Data.Sql >> ' + sql);

        db.transaction( function(transaction) {
            transaction.executeSql(sql, [], function(transaction, rs) {
                _callbackResponse(callback, rs);
            }, function(transaction, error) {
                transaction.executedQuery = sql;
                _throwError.apply(null, arguments);
            });
        });
    };

    var _createSchema = function() {
        var schema = CONFIG.schema;
        var schema_len = schema.length;
        if (!schema_len) return;

        for (var i = 0; i < schema_len; i++) {
            var current = schema[i];

            _regenerateTable(current);
            _createTable(current.name, current.fields);
        }
    };

    var _createTable = function(table, fields) {
        var sql_fields = '';
        for (var field in fields) {
            if (lng.Core.isOwnProperty(fields, field)) {
                if (sql_fields) sql_fields += ', ';
                sql_fields += field + ' ' + fields[field];
            }
        }

        execute('CREATE TABLE IF NOT EXISTS ' + table + ' (' + sql_fields + ');');
    };

    var _regenerateTable = function(table) {
        if (table.drop === true) {
            _dropTable(table.name);
        }
    };

    var _dropTable = function(table) {
        execute('DROP TABLE IF EXISTS ' + table);
    };

    var _convertToSql = function(fields, separator) {
        var sql = '';

        for (var field in fields) {
            if (lng.Core.isOwnProperty(fields, field)) {
                var value = fields[field];
                if (sql) sql += ' ' + separator + ' ';
                sql += field + '=';
                sql += (isNaN(value)) ? '"' + value + '"' : value;
            }
        }
        return sql;
    };

    var _callbackResponse = function(callback, response) {
        if (lng.Core.toType(callback) === 'function') {
            setTimeout(callback, 100, response);
        }
    };

    var _insertRow = function(table, row) {
        var fields = '';
        var values = '';

        for (var field in row) {
            if (lng.Core.isOwnProperty(row, field)) {
                var value = row[field];
                fields += (fields) ? ', ' + field : field;
                if (values) values += ', ';
                values += (isNaN(value) || value=='') ? '"' + value + '"' : value;
            }
        }

        execute('INSERT INTO ' + table + ' (' + fields + ') VALUES (' + values + ')');
    };

    var _throwError = function(transaction, error) {
        throw new Error(ERROR.DATABASE_TRANSACTION + error.code + ': ' + error.message + ' \n Executed query: ' + transaction.executedQuery);
    };

    return {
        init: init,
        select: select,
        insert: insert,
        update: update,
        drop: drop,
        execute: execute
    };

})(Lungo);

/**
 * Wrapper for using LocalStorage & SessionStorage (HTML5 Feature)
 *
 * @namespace Lungo.Data
 * @class Storage
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Data.Storage = (function(lng, undefined) {

    var STORAGE = {
        PERSISTENT: 'localStorage',
        SESSION: 'sessionStorage'
    };

    /**
     * Wrapper for SessionStorage
     *
     * @method persistent
     *
     * @param {string} Key
     * @param {object} Value
     * @return {string} If no value assigned returns the value of established key
     */
    var persistent = function(key, value) {
        return _handler(STORAGE.PERSISTENT, key, value);
    };

    /**
     * Wrapper for SessionStorage
     *
     * @method session
     *
     * @param {string} Key
     * @param {object} Value
     * @return {string} If no value assigned returns the value of established key
     */
    var session = function(key, value) {
        return _handler(STORAGE.SESSION, key, value);
    };

    var _handler = function(storage, key, value) {
        var storage = window[storage];

        if (value) {
            _saveKey(storage, key, value);
        } else if (value === null) {
            _removeKey(storage, key);
        } else {
            return _getKey(storage, key);
        }
    };

    var _saveKey = function(storage, key, value) {
        value = JSON.stringify(value);
        storage.setItem(key, value);
    };

    var _removeKey = function(storage, key) {
        storage.removeItem(key);
    };

    var _getKey = function(storage, key) {
        value = storage.getItem(key);
        return JSON.parse(value);
    };

    return {
        session: session,
        persistent: persistent
    };

})(Lungo);

/**
 * DOM Elements caching
 *
 * @namespace Lungo.Element
 * @class Cache
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Element.Cache = {
    // sections: null,
    section: null,

    article: null,

    aside: null,

    navigation: null
};

/**
 * Creates a instance of Carousel Element
 *
 * @namespace Lungo.Element
 * @class Carousel
 * @version 1.0
 *
 * @author Ignacio Olalde <ina@tapquo.com> || @piniphone
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */


Lungo.Element.Carousel = function(element, callback) {

    var _instance = {
        index: 0,
        speed: 300,
        callback: callback,
        container: element,
        element: element.children[0],
        slide: undefined,
        slides: [],
        slides_length: 0,
        width: 0,
        start: {},
        isScrolling: undefined,
        deltaX: 0
    };

    var prev = function(delay) {
        if (_instance.index) {
            _slide(_instance.index-1, _instance.speed);
        }
    };

    var next = function(delay) {
        if (_instance.index < _instance.slides_length - 1) {
            _slide(_instance.index + 1, _instance.speed);
        } else {
            _slide(0, _instance.speed);
        }
    };

    var position = function() {
        return _instance.index;
    };

    var refresh = function() {
        _setup();
    };

    var _setup = function() {
        _instance.slides = _instance.element.children;
        _instance.slides_length = _instance.slides.length;
        if (_instance.slides_length < 2) return null;

        _instance.width = ("getBoundingClientRect" in _instance.container) ?
                            _instance.container.getBoundingClientRect().width :
                            _instance.container.offsetWidth;

        if (!_instance.width) return null;
        _instance.element.style.width = (_instance.slides.length * _instance.width) + 'px';
        var index = _instance.slides.length;
        while (index--) {
            var el = _instance.slides[index];
            el.style.width = _instance.width + 'px';
            el.style.display = 'table-cell';
            el.style.verticalAlign = 'top';
        }
        _slide(_instance.index, 0);
        _instance.container.style.visibility = 'visible';
    };

    var _slide = function(index, duration) {
        var style = _instance.element.style;
        if (duration == undefined) {
            duration = _instance.speed;
        }
        style.webkitTransitionDuration = style.MozTransitionDuration =
        style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration =
        duration + 'ms';

        style.MozTransform = style.webkitTransform = 'translate3d(' + -(index * _instance.width) + 'px,0,0)';
        style.msTransform = style.OTransform = 'translateX(' + -(index * _instance.width) + 'px)';
        _instance.index = index;
    };

    var _handleGestures = function() {
        _instance.element.addEventListener('touchstart', _touchStart, false);
        _instance.element.addEventListener('touchmove', _touchMove, false);
        _instance.element.addEventListener('touchend', _touchEnd, false);
        _instance.element.addEventListener('webkitTransitionEnd', _transitionEnd, false);
        _instance.element.addEventListener('msTransitionEnd', _transitionEnd, false);
        _instance.element.addEventListener('oTransitionEnd', _transitionEnd, false);
        _instance.element.addEventListener('transitionend', _transitionEnd, false);
        window.addEventListener('resize', _setup, false);
    };

    var _touchStart = function(event) {
        _instance.start = {
            pageX: event.touches[0].pageX,
            pageY: event.touches[0].pageY,
            time: Number(new Date())
        };
        _instance.isScrolling = undefined;
        _instance.deltaX = 0;
        _instance.element.style.MozTransitionDuration = _instance.element.style.webkitTransitionDuration = 0;
        event.stopPropagation();
    };

    var _touchMove = function(e) {
        if(e.touches.length > 1 || e.scale && e.scale !== 1) return;
        _instance.deltaX = e.touches[0].pageX - _instance.start.pageX;
        if ( typeof _instance.isScrolling == 'undefined') {
            _instance.isScrolling = !!( _instance.isScrolling || Math.abs(_instance.deltaX) < Math.abs(e.touches[0].pageY - _instance.start.pageY) );
        }
        if (!_instance.isScrolling) {
            e.preventDefault();
            var factor = ((!_instance.index && _instance.deltaX > 0
                    || _instance.index == _instance.slides_length - 1
                    && _instance.deltaX < 0
                    ) ?
                    (Math.abs(_instance.deltaX) / _instance.width + 1)
                    :1);
            _instance.deltaX = _instance.deltaX / factor;
            var pos = (_instance.deltaX - _instance.index * _instance.width);
            _instance.element.style.MozTransform = _instance.element.style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';
            e.stopPropagation();
        }
    };

    var _touchEnd = function(e) {
        var isValidSlide =
            Number(new Date()) - _instance.start.time < 250
            && Math.abs(_instance.deltaX) > 20
            || Math.abs(_instance.deltaX) > _instance.width/2;
        var isPastBounds =
            !_instance.index && _instance.deltaX > 0
            || _instance.index == _instance.slides_length - 1
            && _instance.deltaX < 0;
        if (!_instance.isScrolling) {
            _slide( _instance.index + ( isValidSlide && !isPastBounds ? (_instance.deltaX < 0 ? 1 : -1) : 0 ), _instance.speed );
        }
        e.stopPropagation();
    };

    var _transitionEnd = function(event) {
        if(_instance.callback) {
            _instance.callback.apply(_instance.callback, [_instance.index, _instance.slides[_instance.index]]);
        }
    };

    _setup();
    _handleGestures();

    return {
        prev: prev,
        next: next,
        position: position,
        refresh: refresh
    };
};

/**
 * Creates a instance of Carousel Element
 *
 * @namespace Lungo.Element
 * @class Carousel
 * @version 1.0
 *
 * @author Ignacio Olalde <ina@tapquo.com> || @piniphone
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */


Lungo.Element.Carousel = function(element, callback) {

    var _instance = {
        gestureStarted: false,
        index: 0,
        speed: 300,
        callback: callback,
        container: element,
        element: element.children[0],
        slide: undefined,
        slides: [],
        slides_length: 0,
        width: 0,
        start: {},
        isScrolling: undefined,
        deltaX: 0
    };

    var prev = function(delay) {
        if (_instance.index) _slide(_instance.index-1, _instance.speed);
    };

    var next = function(delay) {
        var index = _instance.index < _instance.slides_length - 1 ? _instance.index + 1 : 0;
        _slide(index, _instance.speed);
    };

    var position = function() {
        return _instance.index;
    };

    var refresh = function() {
        _setup();
    };

    var _setup = function() {
        _instance.slides = _instance.element.children;
        _instance.slides_length = _instance.slides.length;
        if (_instance.slides_length < 2) return null;

        _instance.width = ("getBoundingClientRect" in _instance.container) ?
                            _instance.container.getBoundingClientRect().width :
                            _instance.container.offsetWidth;

        if (!_instance.width) return null;
        _instance.element.style.width = (_instance.slides.length * _instance.width) + 'px';
        var index = _instance.slides.length;
        while (index--) {
            var el = _instance.slides[index];
            el.style.width = _instance.width + 'px';
            el.style.display = 'table-cell';
            el.style.verticalAlign = 'top';
        }
        _slide(_instance.index, 0);
        _instance.container.style.visibility = 'visible';
    };

    var _slide = function(index, duration) {
        var style = _instance.element.style;
        if (duration == undefined) {
            duration = _instance.speed;
        }
        style.webkitTransitionDuration = style.MozTransitionDuration =
        style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration =
        duration + 'ms';
        style.MozTransform = style.webkitTransform = 'translate3d(' + -(index * _instance.width) + 'px,0,0)';
        style.msTransform = style.OTransform = 'translateX(' + -(index * _instance.width) + 'px)';
        _instance.index = index;
    };

    var _handleGestures = function() {
        $$(_instance.element).swiping(function(event) {
            if(!_instance.gestureStarted) _startGesture(event);
            else _moveGesture(event);
        });
        $$(_instance.element).swipe(_handleGestureEnd);
        $$(_instance.element).on('webkitTransitionEnd', _transitionEnd, false);
        $$(_instance.element).on('msTransitionEnd', _transitionEnd, false);
        $$(_instance.element).on('oTransitionEnd', _transitionEnd, false);
        $$(_instance.element).on('transitionend', _transitionEnd, false);
        $$(window).on('resize', _setup, false);
    };

    _startGesture = function(event) {
        _instance.start = {
            pageX: event.currentTouch.x,
            pageY: event.currentTouch.y,
            time: Number(new Date())
        };
        _instance.isScrolling = undefined;
        _instance.deltaX = 0;
        _instance.element.style.MozTransitionDuration = _instance.element.style.webkitTransitionDuration = 0;
        if(typeof event.stopPropagation === "function") event.stopPropagation();
        _instance.gestureStarted = true;
    };

    _moveGesture = function(event) {
        _instance.deltaX = event.currentTouch.x - _instance.start.pageX;
        if ( typeof _instance.isScrolling == 'undefined') {
            _instance.isScrolling = !!( _instance.isScrolling || Math.abs(_instance.deltaX) < Math.abs(event.currentTouch.y - _instance.start.pageY) );
        }
        if (!_instance.isScrolling) {
            event.preventDefault();
            var factor = ((!_instance.index && _instance.deltaX > 0
                    || _instance.index == _instance.slides_length - 1
                    && _instance.deltaX < 0
                    ) ?
                    (Math.abs(_instance.deltaX) / _instance.width + 1)
                    :1);
            _instance.deltaX = _instance.deltaX / factor;
            var pos = (_instance.deltaX - _instance.index * _instance.width);
            _instance.element.style.MozTransform = _instance.element.style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';
            if(typeof event.stopPropagation === "function") event.stopPropagation();
        }
    };

    var _handleGestureEnd = function() {
        if(_instance.gestureStarted) {
            var isValidSlide =
                Number(new Date()) - _instance.start.time < 250
                && Math.abs(_instance.deltaX) > 20
                || Math.abs(_instance.deltaX) > _instance.width/2;
            var isPastBounds =
                !_instance.index && _instance.deltaX > 0
                || _instance.index == _instance.slides_length - 1
                && _instance.deltaX < 0;
            if (!_instance.isScrolling) {
                _slide( _instance.index + ( isValidSlide && !isPastBounds ? (_instance.deltaX < 0 ? 1 : -1) : 0 ), _instance.speed );
            }
            if(typeof event.stopPropagation === "function") event.stopPropagation();
            _instance.gestureStarted = false;
        }
    };

    var _transitionEnd = function(event) {
        if(_instance.callback) {
            _instance.callback.apply(_instance.callback, [_instance.index, _instance.slides[_instance.index]]);
        }
    };

    _setup();
    _handleGestures();

    return {
        prev: prev,
        next: next,
        position: position,
        refresh: refresh
    };
};

/**
  * Set a counter to the element
 *
 * @namespace Lungo.Element
 * @class count
 *
 * @param  {string} Element query selector
 * @param  {number} Value for counter
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Element.count = function(selector, count) {
    var element = Lungo.dom(selector);
    element.children('.bubble.count').remove();

    if (element && count) {
        var binding = Lungo.Constants.BINDING.SELECTOR;
        html = Lungo.Attributes.count.html.replace(binding, count);
        element.append(html);
    }
};

/**
 * Creates a loading element in any area of layout
 *
 * @namespace Lungo.Element
 * @method loading
 *
 * @param  {string}  Element query selector
 * @param  {number}  stylesheet (null for hide)
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Element.loading = function(selector, stylesheet) {
    var element = Lungo.dom(selector);

    if (element) {
        var html = null;

        if (stylesheet) {
            var binding = Lungo.Constants.BINDING.SELECTOR;
            html = Lungo.Attributes.loading.html.replace(binding, stylesheet);
        }
        element.html(html);
    }
};

/**
 * Set a progress to the element
 *
 * @namespace Lungo.Element
 * @method Progress
 *
 * @param  {string}  Element query selector
 * @param  {number}  Percentage
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Element.progress = function(selector, percentage) {
    var element = Lungo.dom(selector);

    if (element) {
        percentage += Lungo.Constants.ATTRIBUTE.PERCENT;
        element.find('.value').style(Lungo.Constants.ATTRIBUTE.WIDTH, percentage);
    }
};

/**
 * Creates a instance of Pull & Refresh Element
 *
 * @namespace Lungo.Element
 * @class Pull
 * @version 1.0
 *
 * @author Ignacio Olalde <ina@tapquo.com> || @piniphone
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.Element.Pull = function(element_selector, config_data) {

    var REFRESHING_HEIGHT = 60;
    var MAX_HEIGHT = 80;
    var ANIMATION_TIME = 300;
    var CURRENT_DISTANCE = 0;
    var REFRESHING = false;
    var ELEMENT = $$(element_selector);
    var CONTAINER = ELEMENT.siblings('div[data-control="pull"]');
    var CONFIG;

    var CONFIG_BASE ={
        onPull: "Pull down to refresh",
        onRelease: "Release to...",
        onRefresh: "Loading...",
        callback: undefined
    };

    CONFIG = Lungo.Core.mix(CONFIG_BASE, config_data);

    var hide = function() {
        _moveElementTo(0, true);
        setTimeout(function() {
            REFRESHING = false;
            document.removeEventListener('touchmove', _blockGestures, false);
        }, ANIMATION_TIME);
        CURRENT_DISTANCE = 0;
    };

    var _moveElementTo = function(posY, animate) {
        var newPos = posY > MAX_HEIGHT ? MAX_HEIGHT : posY;
        if(animate) ELEMENT.addClass('pull');

        ELEMENT.style('-webkit-transform', 'translate(0, ' + (newPos) + 'px)');
        if(animate) {
            setTimeout(function() {
                ELEMENT.removeClass('pull');
            }, ANIMATION_TIME);
        }
    };

    var _refreshStart = function(event) {
        REFRESHING = true;
        document.addEventListener('touchmove', _blockGestures, false);
        _setContainerTitle(CONFIG.onRefresh);
        _setContainerLoading(true);
        _moveElementTo(REFRESHING_HEIGHT, true);

        if (CONFIG.callback) {
            CONFIG.callback.apply(this);
        }
    };

    var _setContainerTitle = function(title) {
        CONTAINER.find('strong').html(title);
    };

    var _setContainerLoading = function(op) {
        if (op) {
            CONTAINER.addClass("refresh");
        } else {
            CONTAINER.removeClass("refresh");
        }
    };

    var _setContainerOnPulling = function(op) {
        if (op) {
            CONTAINER.addClass("rotate");
        } else {
            CONTAINER.removeClass("rotate");
        }
    };

    var _blockGestures = function(touchEvent) {
        touchEvent.preventDefault();
    };

    var _handlePulling = function(event) {
        _moveElementTo(CURRENT_DISTANCE, false);
        _setContainerLoading(false);
        if (CURRENT_DISTANCE > REFRESHING_HEIGHT) {
            _setContainerTitle(CONFIG.onRelease);
            _setContainerOnPulling(true);
        } else {
            _setContainerTitle(CONFIG.onPull);
            _setContainerOnPulling(false);
        }
    };

    var _handlePullEnd = function(event) {
        if(CURRENT_DISTANCE > REFRESHING_HEIGHT) _refreshStart(); else hide();
    };

    (function() {
        var STARTED = false;
        var INI_Y = {};
        ELEMENT.bind('touchstart', function(event) {
            if(ELEMENT[0].scrollTop <= 1) {
                STARTED = true;
                INI_Y = $$.isMobile() ? event.touches[0].pageY : event.pageY;
            }
        }).bind('touchmove', function(event) {
            if(!REFRESHING && STARTED) {
                current_y = $$.isMobile() ? event.touches[0].pageY : event.pageY;
                CURRENT_DISTANCE = current_y - INI_Y;
                if(CURRENT_DISTANCE >= 0) {
                    ELEMENT.style('overflow-y', 'hidden');
                    _handlePulling();
                }
            }
        }).bind('touchend', function() {
            if(STARTED) {
                ELEMENT.style('overflow-y', 'scroll');
                _handlePullEnd();
            }
            INI_TOUCH = {};
            STARTED = false;
        });
    })();

    return {
        hide: hide
    };
};

/**
 * Handles the <sections> and <articles> to show
 *
 * @namespace Lungo
 * @class Router
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Router = (function(lng, undefined) {

    var CLASS = lng.Constants.CLASS;
    var ELEMENT = lng.Constants.ELEMENT;
    var ERROR = lng.Constants.ERROR;
    var TRIGGER = lng.Constants.TRIGGER;
    var ATTRIBUTE = lng.Constants.ATTRIBUTE;
    var HASHTAG_CHARACTER = '#';

    /**
     * Navigate to a <section>.
     *
     * @method section
     *
     * @param {string} Id of the <section>
     */
    var section = function(section_id) {
        section_id = lng.Core.parseUrl(section_id);
        var current =  lng.Element.Cache.section;

        if (_notCurrentTarget(section_id, current)) {
            var target = current.siblings(ELEMENT.SECTION + section_id);

            if (target.length > 0) {
                target_transition = target.data('transition');
                if (target_transition) {
                    _assignTransitionOrigin(current);
                    _assignTransition(current, target_transition);
                }

                current.removeClass(CLASS.SHOW).addClass(CLASS.HIDE);
                target.removeClass(CLASS.HIDE).addClass(CLASS.SHOW);
                lng.Element.Cache.section = target;
                lng.Element.Cache.article = target.find(ELEMENT.ARTICLE + '.' + CLASS.ACTIVE);

                lng.Router.History.add(section_id);
                _sectionTriggers(current, target);
            }
        }
    };

    /**
     * Displays the <article> in a particular <section>.
     *
     * @method article
     *
     * @param {string} <section> Id
     * @param {string} <article> Id
     */
    var article = function(section_id, article_id, element) {
        article_id = lng.Core.parseUrl(article_id);

        var current =  lng.Element.Cache.article;
        if (_notCurrentTarget(article_id, current)) {
            section(section_id);
            var target = lng.Element.Cache.section.find(ELEMENT.ARTICLE + article_id);

            if (target.length > 0) {
                if (_sectionId(current) !== _sectionId(target)) {
                    current = lng.Element.Cache.section.children(ELEMENT.ARTICLE);
                }

                current.removeClass(CLASS.ACTIVE).trigger(TRIGGER.UNLOAD);
                target.addClass(CLASS.ACTIVE).trigger(TRIGGER.LOAD);

                lng.Element.Cache.article = target;

                lng.View.Article.switchNavItems(article_id);
                lng.View.Article.switchReferenceItems(article_id, lng.Element.Cache.section);

                if (element) lng.View.Article.title(element.data(ATTRIBUTE.TITLE));
            }
        }
    };

    /**
     * Displays the <aside> in a particular <section>.
     *
     * @method aside
     *
     * @param {string} <section> Id
     * @param {string} <aside> Id
     */
    var aside = function(section_id, aside_id) {
        aside_id = lng.Core.parseUrl(aside_id);
        lng.View.Aside.toggle(aside_id);
    };

    /**
     * Return to previous section.
     *
     * @method back
     */
    var back = function() {
        var current = lng.Element.Cache.section;
        current.removeClass(CLASS.SHOW).addClass(CLASS.HIDING);

        // #TODO: Refactor
        setTimeout(function() {
            current.removeClass(CLASS.HIDING);
        }, lng.Constants.TRANSITION.DURATION);

        lng.Router.History.removeLast();
        target = current.siblings(ELEMENT.SECTION + lng.Router.History.current());

        _assignTransition(target, target.data('transition-origin'));
        target.removeClass(CLASS.HIDE).addClass(CLASS.SHOW);
        lng.Element.Cache.section = target;
        lng.Element.Cache.article = target.find(ELEMENT.ARTICLE + "." + CLASS.ACTIVE);

        _sectionTriggers(current, target);
    };

    var _notCurrentTarget = function(target, element) {
        return (target !== HASHTAG_CHARACTER + element.attr('id')) ? true : false;
    };

    var _sectionId = function(element) {
        return element.parent('section').attr('id');
    };

    var _sectionTriggers = function(current, target) {
        current.trigger(TRIGGER.UNLOAD);
        target.trigger(TRIGGER.LOAD);
    };

    var _assignTransition = function(section, transitionName) {
        section.data('transition', transitionName);
    };

    var _assignTransitionOrigin = function(section) {
        section.data('transition-origin', section.data('transition'));
    };

    return {
        section: section,
        article: article,
        aside: aside,
        back: back
    };

})(Lungo);

/**
 * Stores the displayed <sections> as a historical.
 *
 * @namespace Lungo.Router
 * @class History
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.Router.History = (function(undefined) {

     var _history = [];

     /**
      * Create a new element to the browsing history based on the current section id.
      *
      * @method add
      *
      * @param  {string} Id of the section
      */
     var add = function(section_id) {
         if (section_id !== current()) {
             _history.push(section_id);
         }
     };

     /**
      * Returns the current browsing history section id.
      *
      * @method current
      *
      * @return {string} Current section id
      */
     var current = function() {
         return _history[_history.length - 1];
     };

     /**
      * Removes the current item browsing history.
      *
      * @method removeLast
      */
     var removeLast = function() {
         _history.length -= 1;
     };

    return {
        add: add,
        current: current,
        removeLast: removeLast
    };

})();

/**
 * Initialize the <articles> layout of a certain <section>
 *
 * @namespace Lungo.View
 * @class Article
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 * @author Guillermo Pascual <pasku@tapquo.com> || @pasku1
 */

Lungo.View.Article = (function(lng, undefined) {

    var ELEMENT = lng.Constants.ELEMENT;
    var CLASS = lng.Constants.CLASS;
    var ATTRIBUTE = lng.Constants.ATTRIBUTE;

    var SELECTORS = {
        NAVIGATION_ITEM: 'a[href][data-router="article"]',
        REFERENCE_LINK: ' a[href][data-article]',
        TITLE_OF_ARTICLE: 'header .title, footer .title',
        ASIDE_REFERENCE_LIST: 'li a.active, li.active'
    };

    /**
     * ?
     *
     * @method show
     */
    var title = function(value) {
        if (value) {
            lng.Element.Cache.section.find(SELECTORS.TITLE_OF_ARTICLE).text(value);
        }
    };

    var switchNavItems = function(article_id) {
        lng.Element.Cache.section.find(SELECTORS.NAVIGATION_ITEM).removeClass(CLASS.ACTIVE);

        var active_nav_items = 'a[href="' + article_id + '"][data-router="article"]';
        lng.Element.Cache.section.find(active_nav_items).addClass(CLASS.ACTIVE);

        if (lng.Element.Cache.aside) {
            aside = lng.Element.Cache.aside;

            aside.find(SELECTORS.ASIDE_REFERENCE_LIST).removeClass(CLASS.ACTIVE);
            aside.find(active_nav_items).addClass(CLASS.ACTIVE).parent().addClass(CLASS.ACTIVE);
        }
    };

    var switchReferenceItems = function(article_id, section) {
        var reference = "[data-article=" + article_id.replace('#', '') + "]";
        section.find(SELECTORS.REFERENCE_LINK).hide().siblings(reference).show();
    };

    return {
        title: title,
        switchReferenceItems: switchReferenceItems,
        switchNavItems: switchNavItems
    };

})(Lungo);

/**
 * Initialize the <articles> layout of a certain <section>
 *
 * @namespace Lungo.View
 * @class Aside
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

Lungo.View.Aside = (function(lng, undefined) {

    var ELEMENT = lng.Constants.ELEMENT;
    var CLASS = lng.Constants.CLASS;
    var ATTRIBUTE = lng.Constants.ATTRIBUTE;

    /**
     * Toggle an aside element
     *
     * @method toggle
     *
     * @param  {string} Aside id
     */
    var toggle = function(aside_id) {
        aside = _findAside(aside_id);
        if (aside) {
            var is_visible = aside.hasClass(CLASS.SHOW);
            if (is_visible) {
                lng.View.Aside.hide();
            } else {
                lng.View.Aside.show(aside);
            }
        }
        aside = null;
    };

    /**
     * Display an aside element with a particular <section>
     *
     * @method show
     *
     * @param  {string} Aside id
     */
    var show = function(aside) {
        if (lng.Core.toType(aside) == 'string') aside = _findAside(lng.Core.parseUrl(aside));
        if (aside) {
            lng.Element.Cache.aside = aside;
            var aside_stylesheet = _asideStylesheet(aside);

            aside.addClass(CLASS.SHOW);
            lng.Element.Cache.section.addClass(aside_stylesheet).addClass(CLASS.ASIDE);
        }

        aside = null;
    };

    /**
     * Hide an aside element with a particular section
     *
     * @method hide
     */
    var hide = function(target) {
        var aside = lng.Element.Cache.aside || target;
        if (aside) {
            lng.Element.Cache.section.removeClass(CLASS.ASIDE).removeClass(CLASS.RIGHT).removeClass(CLASS.SMALL);

            var aside_stylesheet = _asideStylesheet(aside);
            if (aside_stylesheet) {
                lng.Element.Cache.section.removeClass(aside_stylesheet);
            }

            setTimeout(function() {
                aside.removeClass(CLASS.SHOW);
                lng.Element.Cache.aside = null;
            }, 350);
        }
    };

    var suscribeEvents = function(hrefs) {
        var MIN_XDIFF = parseInt(document.body.getBoundingClientRect().width / 3, 10);
        hrefs.each(function() {
            var STARTED = false;
            var a = lng.dom(this);
            var section = a.closest("section");
            var aside = lng.dom(a.attr("href"));

            section.swiping(function(gesture) {
                if(!section.hasClass("aside")) {
                    var xdiff =  gesture.currentTouch.x - gesture.iniTouch.x;
                    var ydiff =  Math.abs(gesture.currentTouch.y - gesture.iniTouch.y);
                    STARTED = STARTED ? true : xdiff > 3*ydiff && xdiff < 50;
                    if(STARTED) {
                        xdiff = xdiff > 256 ? 256 : xdiff < 0 ? 0 : xdiff;
                        aside.addClass(CLASS.SHOW);
                        section.vendor('transform', 'translateX(' + xdiff + 'px)');
                        section.vendor('transition-duration', '0s');
                    } else {
                        section.attr('style', '');
                    }
                }
            });

            section.swipe(function(gesture) {
                var diff = gesture.currentTouch.x - gesture.iniTouch.x;
                var ydiff =  Math.abs(gesture.currentTouch.y - gesture.iniTouch.y);
                section.attr('style', '');
                if(diff > MIN_XDIFF && STARTED) show(aside);
                else hide(aside);
                STARTED = false;
            });
        });
    };

    var _findAside = function(aside_id) {
        var aside = null;
        var asides = lng.dom(ELEMENT.ASIDE);

        if (asides.length == 1) {
            var current_id = '#' + asides[0].id ;
            if (current_id == aside_id) {
                aside = lng.dom(asides[0]);
            }
        }
        else if (asides.length > 1) {
            aside = asides.siblings(ELEMENT.ASIDE + aside_id);
        }

        return aside;
    };

    var _asideStylesheet = function(aside) {
        var aside_stylesheet = aside.attr(ATTRIBUTE.CLASS);
        var classes = '';

        //@todo: Refactor
        if (aside_stylesheet) {
            classes += (aside_stylesheet.indexOf(CLASS.RIGHT) > -1) ? CLASS.RIGHT + ' ': '';
            classes += (aside_stylesheet.indexOf(CLASS.SMALL) > -1) ? CLASS.SMALL + ' ': '';
        }

        return classes;
    };

    return {
        suscribeEvents: suscribeEvents,
        toggle: toggle,
        show: show,
        hide: hide
    };

})(Lungo);

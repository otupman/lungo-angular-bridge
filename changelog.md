# Lungo Angular Bridge Changelog

## v0.1.0 - ?? ??, 2013
### Changes
 - Feature: popup windows!
 - Feature: lab-(event) - directives for touch, tap, swipe, etc: lab-touch, lab-tap, lab-swipe, lab-etc :)
 - Feature: New website
 - Feature: grunt demoServer to just get started
 - Feature: lab-scenario.js included to provide labElem([selector]).[method] - tap, touch, etc.
 - Change: Split the single source file into separate ones and added grunt task to bring them all together
 - Fixed: issue where data-title had stopped working
 - Fixed: issue where direction-specific events (such as swipeLeft, swipeUp, etc.) were not working
 - Fixed: issue where the new labRouterService wasn't properly returning values
 
## v0.0.5 - April 25th, 2013
### Changes
 - Fix: Issue #62 Lungo's swipe-to-show-aside functionality now works (as long as you're using the lab-aside directive)
 - Fix: Issue #52 where navigating back rapidly would leave a section "on top of" the aside
 - Improvement: added e2e tests for the todo demo
## v0.0.4 - April 22nd, 2013
### Changes
 - Fix: Issue #56 Resolved incompatibility with a change to Angular 1.0.6
 - Chore: Updated Angular dependency to 1.0.6 following above fix
 - Chore: Added this changelog file

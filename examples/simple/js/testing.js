/**
 * This code attempts to intercept calls to the Lungo router and modify the DOM,
 * essentially implementing the ability to 'spy' on Router calls and then inspect
 * them from within the e2E test.
 *
 * Works in the real world, but not in the e2e test. Sigh
 *
 */
Lungo.Router.section = (function() {
    var originalFn = Lungo.Router.section;
    var sectionCallCount = 0;
    return function(sectionId) {
        document.getElementById('lungo-router-section').text = sectionCallCount;
        sectionCallCount++;
        originalFn(sectionId);
    }
})();
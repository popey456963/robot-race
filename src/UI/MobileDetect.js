var MobileDetect = require('mobile-detect');
var md = new MobileDetect(window.navigator.userAgent);

module.exports = md.mobile();